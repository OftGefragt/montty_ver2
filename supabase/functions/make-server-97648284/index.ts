import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.ts";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-97648284/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all colleagues
app.get("/make-server-97648284/colleagues", async (c) => {
  try {
    const colleagues = await kv.getByPrefix("colleague:");
    return c.json({ colleagues: colleagues || [] });
  } catch (error) {
    console.log("Error fetching colleagues:", error);
    return c.json({ error: "Failed to fetch colleagues" }, 500);
  }
});

// Add a new colleague
app.post("/make-server-97648284/colleagues", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, role } = body;
    
    if (!name || !email) {
      return c.json({ error: "Name and email are required" }, 400);
    }
    
    const colleagueId = `colleague:${Date.now()}`;
    const colleague = {
      id: colleagueId,
      name,
      email,
      role: role || "Team Member",
      addedAt: new Date().toISOString(),
    };
    
    await kv.set(colleagueId, colleague);
    return c.json({ colleague });
  } catch (error) {
    console.log("Error adding colleague:", error);
    return c.json({ error: "Failed to add colleague" }, 500);
  }
});

// Get all activities
app.get("/make-server-97648284/activities", async (c) => {
  try {
    const activities = await kv.getByPrefix("activity:");
    // Sort by timestamp descending
    const sortedActivities = (activities || []).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ activities: sortedActivities });
  } catch (error) {
    console.log("Error fetching activities:", error);
    return c.json({ error: "Failed to fetch activities" }, 500);
  }
});

// Add a new activity
app.post("/make-server-97648284/activities", async (c) => {
  try {
    const body = await c.req.json();
    const { type, title, description } = body;
    
    if (!type || !title || !description) {
      return c.json({ error: "Type, title, and description are required" }, 400);
    }
    
    const activityId = `activity:${Date.now()}`;
    const activity = {
      id: activityId,
      type,
      title,
      description,
      createdAt: new Date().toISOString(),
      date: getRelativeTime(new Date()),
    };
    
    await kv.set(activityId, activity);
    return c.json({ activity });
  } catch (error) {
    console.log("Error adding activity:", error);
    return c.json({ error: "Failed to add activity" }, 500);
  }
});

// Get notifications for a user (activities they haven't seen)
app.get("/make-server-97648284/notifications/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const lastSeenKey = `lastseen:${userId}`;
    
    // Get the last time user checked notifications
    const lastSeen = await kv.get(lastSeenKey);
    const lastSeenTime = lastSeen ? new Date(lastSeen as string) : new Date(0);
    
    // Get all activities
    const activities = await kv.getByPrefix("activity:");
    
    // Filter activities newer than lastSeen
    const newActivities = (activities || []).filter((activity: any) =>
      new Date(activity.createdAt) > lastSeenTime
    );
    
    return c.json({ 
      notifications: newActivities,
      count: newActivities.length 
    });
  } catch (error) {
    console.log("Error fetching notifications:", error);
    return c.json({ error: "Failed to fetch notifications" }, 500);
  }
});

// Mark notifications as seen
app.post("/make-server-97648284/notifications/:userId/mark-seen", async (c) => {
  try {
    const userId = c.req.param("userId");
    const lastSeenKey = `lastseen:${userId}`;
    
    await kv.set(lastSeenKey, new Date().toISOString());
    return c.json({ success: true });
  } catch (error) {
    console.log("Error marking notifications as seen:", error);
    return c.json({ error: "Failed to mark notifications as seen" }, 500);
  }
});

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

// Get cash asset
app.get("/make-server-97648284/cash", async (c) => {
  try {
    const cash = await kv.get("cash_asset");
    return c.json({ cash: cash || 0 });
  } catch (error) {
    console.log("Error fetching cash:", error);
    return c.json({ error: "Failed to fetch cash" }, 500);
  }
});

// Update cash asset
app.put("/make-server-97648284/cash", async (c) => {
  try {
    const body = await c.req.json();
    const { amount } = body;
    
    if (amount === undefined || amount < 0) {
      return c.json({ error: "Valid amount is required" }, 400);
    }
    
    const cashData = {
      amount: parseFloat(amount),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set("cash_asset", cashData);
    return c.json({ success: true, cash: cashData });
  } catch (error) {
    console.log("Error updating cash:", error);
    return c.json({ error: "Failed to update cash" }, 500);
  }
});

// Get other expenses
app.get("/make-server-97648284/other-expenses", async (c) => {
  try {
    const expenses = await kv.get("other_expenses");
    return c.json({ expenses: expenses || 0 });
  } catch (error) {
    console.log("Error fetching other expenses:", error);
    return c.json({ error: "Failed to fetch other expenses" }, 500);
  }
});

// Update other expenses
app.put("/make-server-97648284/other-expenses", async (c) => {
  try {
    const body = await c.req.json();
    const { amount } = body;
    
    if (amount === undefined || amount < 0) {
      return c.json({ error: "Valid amount is required" }, 400);
    }
    
    const expensesData = {
      amount: parseFloat(amount),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set("other_expenses", expensesData);
    return c.json({ success: true, expenses: expensesData });
  } catch (error) {
    console.log("Error updating other expenses:", error);
    return c.json({ error: "Failed to update other expenses" }, 500);
  }
});

// Get all assets
app.get("/make-server-97648284/assets", async (c) => {
  try {
    const assets = await kv.getByPrefix("asset:");
    // Sort by date descending
    const sortedAssets = (assets || []).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ assets: sortedAssets });
  } catch (error) {
    console.log("Error fetching assets:", error);
    return c.json({ error: "Failed to fetch assets" }, 500);
  }
});

// Add a new asset
app.post("/make-server-97648284/assets", async (c) => {
  try {
    const body = await c.req.json();
    const { name, value } = body;
    
    if (!name || value === undefined) {
      return c.json({ error: "Name and value are required" }, 400);
    }
    
    const assetId = `asset:${Date.now()}`;
    const asset = {
      id: assetId,
      name,
      value: parseFloat(value),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(assetId, asset);
    return c.json({ success: true, asset });
  } catch (error) {
    console.log("Error adding asset:", error);
    return c.json({ error: "Failed to add asset" }, 500);
  }
});

// Update an asset
app.put("/make-server-97648284/assets/:id", async (c) => {
  try {
    const assetId = c.req.param("id");
    const body = await c.req.json();
    const { name, value } = body;
    
    if (!name || value === undefined) {
      return c.json({ error: "Name and value are required" }, 400);
    }
    
    const existingAsset = await kv.get(assetId);
    if (!existingAsset) {
      return c.json({ error: "Asset not found" }, 404);
    }
    
    const updatedAsset = {
      ...existingAsset,
      name,
      value: parseFloat(value),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(assetId, updatedAsset);
    return c.json({ success: true, asset: updatedAsset });
  } catch (error) {
    console.log("Error updating asset:", error);
    return c.json({ error: "Failed to update asset" }, 500);
  }
});

// Delete an asset
app.delete("/make-server-97648284/assets/:id", async (c) => {
  try {
    const assetId = c.req.param("id");
    console.log("Delete asset request - ID:", assetId);
    await kv.del(assetId);
    console.log("Asset deleted successfully");
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting asset:", error);
    return c.json({ error: "Failed to delete asset" }, 500);
  }
});

// Get all liabilities
app.get("/make-server-97648284/liabilities", async (c) => {
  try {
    const liabilities = await kv.getByPrefix("liability:");
    // Sort by date descending
    const sortedLiabilities = (liabilities || []).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ liabilities: sortedLiabilities });
  } catch (error) {
    console.log("Error fetching liabilities:", error);
    return c.json({ error: "Failed to fetch liabilities" }, 500);
  }
});

// Add a new liability
app.post("/make-server-97648284/liabilities", async (c) => {
  try {
    const body = await c.req.json();
    const { name, value } = body;
    
    if (!name || value === undefined) {
      return c.json({ error: "Name and value are required" }, 400);
    }
    
    const liabilityId = `liability:${Date.now()}`;
    const liability = {
      id: liabilityId,
      name,
      value: parseFloat(value),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(liabilityId, liability);
    return c.json({ success: true, liability });
  } catch (error) {
    console.log("Error adding liability:", error);
    return c.json({ error: "Failed to add liability" }, 500);
  }
});

// Update a liability
app.put("/make-server-97648284/liabilities/:id", async (c) => {
  try {
    const liabilityId = c.req.param("id");
    const body = await c.req.json();
    const { name, value } = body;
    
    if (!name || value === undefined) {
      return c.json({ error: "Name and value are required" }, 400);
    }
    
    const existingLiability = await kv.get(liabilityId);
    if (!existingLiability) {
      return c.json({ error: "Liability not found" }, 404);
    }
    
    const updatedLiability = {
      ...existingLiability,
      name,
      value: parseFloat(value),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(liabilityId, updatedLiability);
    return c.json({ success: true, liability: updatedLiability });
  } catch (error) {
    console.log("Error updating liability:", error);
    return c.json({ error: "Failed to update liability" }, 500);
  }
});

// Delete a liability
app.delete("/make-server-97648284/liabilities/:id", async (c) => {
  try {
    const liabilityId = c.req.param("id");
    console.log("Delete liability request - ID:", liabilityId);
    await kv.del(liabilityId);
    console.log("Liability deleted successfully");
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting liability:", error);
    return c.json({ error: "Failed to delete liability" }, 500);
  }
});

// Get all projects
app.get("/make-server-97648284/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix("project:");
    // Sort by date descending
    const sortedProjects = (projects || []).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ projects: sortedProjects });
  } catch (error) {
    console.log("Error fetching projects:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// Add a new project
app.post("/make-server-97648284/projects", async (c) => {
  try {
    const body = await c.req.json();
    const { name, budget, startDate, endDate, code, status } = body;
    
    if (!name || !budget || !code) {
      return c.json({ error: "Name, budget, and code are required" }, 400);
    }
    
    const projectId = `project:${Date.now()}`;
    const project = {
      id: projectId,
      name,
      budget: parseFloat(budget),
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      code,
      status: status || 'planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: []
    };
    
    await kv.set(projectId, project);
    return c.json({ success: true, project });
  } catch (error) {
    console.log("Error adding project:", error);
    return c.json({ error: "Failed to add project" }, 500);
  }
});

// Update a project
app.put("/make-server-97648284/projects/:id", async (c) => {
  try {
    const projectId = c.req.param("id");
    const body = await c.req.json();
    const { name, budget, startDate, endDate, code, status } = body;
    
    if (!name || !budget || !code) {
      return c.json({ error: "Name, budget, and code are required" }, 400);
    }
    
    const existingProject = await kv.get(projectId);
    if (!existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }
    
    const updatedProject = {
      ...existingProject,
      name,
      budget: parseFloat(budget),
      startDate: startDate || existingProject.startDate,
      endDate: endDate || existingProject.endDate,
      code,
      status: status || existingProject.status,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(projectId, updatedProject);
    return c.json({ success: true, project: updatedProject });
  } catch (error) {
    console.log("Error updating project:", error);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

// Delete a project
app.delete("/make-server-97648284/projects/:id", async (c) => {
  try {
    const projectId = c.req.param("id");
    console.log("Delete project request - ID:", projectId);
    await kv.del(projectId);
    console.log("Project deleted successfully");
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting project:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

// Get all customers
app.get("/make-server-97648284/customers", async (c) => {
  try {
    const customers = await kv.getByPrefix("customer:");
    // Sort by date descending
    const sortedCustomers = (customers || []).sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ customers: sortedCustomers });
  } catch (error) {
    console.log("Error fetching customers:", error);
    return c.json({ error: "Failed to fetch customers" }, 500);
  }
});

// Add a new customer
app.post("/make-server-97648284/customers", async (c) => {
  try {
    const body = await c.req.json();
    const { name, legalName, billingAddress, country, email, phone, status, monthlyRevenue } = body;
    
    if (!name || !email || !monthlyRevenue) {
      return c.json({ error: "Name, email, and monthly revenue are required" }, 400);
    }
    
    const customerId = `customer:${Date.now()}`;
    const customer = {
      id: customerId,
      name,
      legalName: legalName || name,
      billingAddress: billingAddress || '',
      country: country || 'United States',
      email,
      phone: phone || '',
      status: status || 'standard',
      joinDate: new Date().toISOString().split('T')[0],
      isActive: true,
      monthlyRevenue: parseFloat(monthlyRevenue),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(customerId, customer);
    return c.json({ success: true, customer });
  } catch (error) {
    console.log("Error adding customer:", error);
    return c.json({ error: "Failed to add customer" }, 500);
  }
});

// Update a customer
app.put("/make-server-97648284/customers/:id", async (c) => {
  try {
    const customerId = c.req.param("id");
    const body = await c.req.json();
    const { name, legalName, billingAddress, country, email, phone, status, monthlyRevenue, isActive } = body;
    
    if (!name || !email || monthlyRevenue === undefined) {
      return c.json({ error: "Name, email, and monthly revenue are required" }, 400);
    }
    
    const existingCustomer = await kv.get(customerId);
    if (!existingCustomer) {
      return c.json({ error: "Customer not found" }, 404);
    }
    
    const updatedCustomer = {
      ...existingCustomer,
      name,
      legalName: legalName || name,
      billingAddress: billingAddress || existingCustomer.billingAddress,
      country: country || existingCustomer.country,
      email,
      phone: phone || existingCustomer.phone,
      status: status || existingCustomer.status,
      monthlyRevenue: parseFloat(monthlyRevenue),
      isActive: isActive !== undefined ? isActive : existingCustomer.isActive,
      lastActiveDate: isActive === false ? new Date().toISOString().split('T')[0] : existingCustomer.lastActiveDate,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(customerId, updatedCustomer);
    return c.json({ success: true, customer: updatedCustomer });
  } catch (error) {
    console.log("Error updating customer:", error);
    return c.json({ error: "Failed to update customer" }, 500);
  }
});

// Delete a customer
app.delete("/make-server-97648284/customers/:id", async (c) => {
  try {
    const customerId = c.req.param("id");
    console.log("Delete customer request - ID:", customerId);
    await kv.del(customerId);
    console.log("Customer deleted successfully");
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting customer:", error);
    return c.json({ error: "Failed to delete customer" }, 500);
  }
});

// Get all investors
app.get("/make-server-97648284/investors", async (c) => {
  try {
    const investors = await kv.getByPrefix("investor:");
    // Sort by date descending
    const sortedInvestors = (investors || []).sort((a: any, b: any) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return c.json({ investors: sortedInvestors });
  } catch (error) {
    console.log("Error fetching investors:", error);
    return c.json({ error: "Failed to fetch investors" }, 500);
  }
});

// Add a new investor
app.post("/make-server-97648284/investors", async (c) => {
  try {
    const body = await c.req.json();
    const { name, round, amount, date, equity } = body;
    
    if (!name || !round || !amount || !date || equity === undefined) {
      return c.json({ error: "All fields are required" }, 400);
    }
    
    const investorId = `investor:${Date.now()}`;
    const investor = {
      id: investorId,
      name,
      round,
      amount: parseFloat(amount),
      date,
      equity: parseFloat(equity),
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(investorId, investor);
    return c.json({ investor });
  } catch (error) {
    console.log("Error adding investor:", error);
    return c.json({ error: "Failed to add investor" }, 500);
  }
});

Deno.serve(app.fetch);