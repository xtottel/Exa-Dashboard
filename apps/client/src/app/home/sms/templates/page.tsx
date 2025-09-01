
"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, MoreVertical, Trash2, Edit, Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Template = {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "Onboarding", name: "Onboarding" },
    { id: "Security", name: "Security" },
    { id: "Transactions", name: "Transactions" },
    { id: "Promotions", name: "Promotions" },
    { id: "Notifications", name: "Notifications" },
    { id: "Alerts", name: "Alerts" },
  ];

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("bearerToken");
      
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await fetch("/api/templates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }

      const data = await response.json();
      setTemplates(data.data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      template.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handleCreate = () => {
    setCurrentTemplate({
      id: "",
      name: "",
      content: "",
      category: "",
      variables: [],
      createdAt: "",
      updatedAt: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (template: Template) => {
    setCurrentTemplate(template);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setTemplateToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!templateToDelete) return;

    try {
      const token = localStorage.getItem("bearerToken");
      
      if (!token) {
        toast.error("Please login again");
        return;
      }

      const response = await fetch(`/api/templates/${templateToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete template");
      }

      toast.success("Template deleted successfully");
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
      
      // Refresh the list
      fetchTemplates();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error deleting template:", error);
      toast.error(error.message || "Failed to delete template");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTemplate) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("bearerToken");
      
      if (!token) {
        toast.error("Please login again");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...templateData } = currentTemplate;

      const url = id ? `/api/templates/${id}` : "/api/templates";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${id ? 'update' : 'create'} template`);
      }

      const result = await response.json();
      
      setIsDialogOpen(false);
      setCurrentTemplate(null);
      toast.success(result.message || `Template ${id ? 'updated' : 'created'} successfully`);
      
      // Refresh the list
      fetchTemplates();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast.error(error.message || `Failed to ${currentTemplate?.id ? 'update' : 'create'} template`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractVariables = (content: string) => {
    const regex = /\{([^}]+)\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    return Array.from(new Set(matches)); // Remove duplicates
  };

  const handleContentChange = (content: string) => {
    if (!currentTemplate) return;
    const variables = extractVariables(content);
    setCurrentTemplate({
      ...currentTemplate,
      content,
      variables,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Message Templates
            </h1>
            <p className="text-muted-foreground">
              Create and manage your SMS message templates
            </p>
          </div>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading templates...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Message Templates
          </h1>
          <p className="text-muted-foreground">
            Create and manage your SMS message templates
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {currentTemplate?.id
                    ? "Edit Template"
                    : "Create New Template"}
                </DialogTitle>
                <DialogDescription>
                  {currentTemplate?.id
                    ? "Update your template below"
                    : "Create a new message template with variables"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={currentTemplate?.name || ""}
                    onChange={(e) =>
                      currentTemplate &&
                      setCurrentTemplate({
                        ...currentTemplate,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Welcome Message"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={currentTemplate?.category || ""}
                    onChange={(e) =>
                      currentTemplate &&
                      setCurrentTemplate({
                        ...currentTemplate,
                        category: e.target.value,
                      })
                    }
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Select a category</option>
                    {categories.filter(cat => cat.id !== "all").map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={currentTemplate?.content || ""}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Enter your template content. Use {variable} for placeholders."
                    rows={8}
                    className="resize-none"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-muted-foreground">
                    Wrap variables in curly braces like {"{variable}"}
                  </p>
                  {currentTemplate?.variables && currentTemplate.variables.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Detected variables:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {currentTemplate.variables.map((variable) => (
                          <Badge
                            key={variable}
                            variant="outline"
                            className="text-xs"
                          >
                            {"{" + variable + "}"}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentTemplate?.id ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    currentTemplate?.id ? "Update Template" : "Create Template"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-9 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-9 w-[180px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Variables</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      {template.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{template.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <Badge
                            key={variable}
                            variant="outline"
                            className="text-xs"
                          >
                            {"{" + variable + "}"}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(template)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {templates.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Plus className="h-12 w-12 mb-4 opacity-50" />
                        <p>No templates found</p>
                        <p className="text-sm">Create your first template to get started</p>
                      </div>
                    ) : (
                      "No templates match your search criteria"
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        {filteredTemplates.length > 0 && (
          <CardFooter className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-{filteredTemplates.length}</strong> of{" "}
              <strong>{templates.length}</strong> templates
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              template.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
