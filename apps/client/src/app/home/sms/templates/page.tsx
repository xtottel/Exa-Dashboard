"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  // CardTitle,
  CardContent,
  // CardDescription,
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
import { Plus, MoreVertical, Trash2, Edit, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

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
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Welcome Message",
      content:
        "Hello {name}, welcome to {company}! Your account is now active.",
      category: "Onboarding",
      variables: ["name", "company"],
      createdAt: "2023-10-15",
      updatedAt: "2023-10-15",
    },
    {
      id: "2",
      name: "OTP Verification",
      content: "Your verification code is {otp}. Valid for {minutes} minutes.",
      category: "Security",
      variables: ["otp", "minutes"],
      createdAt: "2023-11-02",
      updatedAt: "2023-11-05",
    },
    {
      id: "3",
      name: "Password Reset",
      content: "Click here to reset your password: {link}",
      category: "Security",
      variables: ["link"],
      createdAt: "2023-09-28",
      updatedAt: "2023-09-28",
    },
    {
      id: "4",
      name: "Order Confirmation",
      content:
        "Hi {name}, your order #{orderId} has been confirmed. Delivery in {days} days.",
      category: "Transactions",
      variables: ["name", "orderId", "days"],
      createdAt: "2023-08-10",
      updatedAt: "2023-08-12",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "onboarding", name: "Onboarding" },
    { id: "security", name: "Security" },
    { id: "transactions", name: "Transactions" },
    { id: "promotions", name: "Promotions" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

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

  const confirmDelete = () => {
    if (templateToDelete) {
      setTemplates(templates.filter((t) => t.id !== templateToDelete));
      setIsDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTemplate) return;

    const now = new Date().toISOString().split("T")[0];

    if (currentTemplate.id) {
      // Update existing template
      setTemplates(
        templates.map((t) =>
          t.id === currentTemplate.id
            ? { ...currentTemplate, updatedAt: now }
            : t
        )
      );
    } else {
      // Create new template
      const newTemplate = {
        ...currentTemplate,
        id: `t-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setTemplates([...templates, newTemplate]);
    }

    setIsDialogOpen(false);
    setCurrentTemplate(null);
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={currentTemplate?.category || ""}
                    onChange={(e) =>
                      currentTemplate &&
                      setCurrentTemplate({
                        ...currentTemplate,
                        category: e.target.value,
                      })
                    }
                    placeholder="e.g. Onboarding"
                    required
                  />
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
                  />
                  <p className="text-sm text-muted-foreground">
                    Wrap variables in curly braces like {"{variable}"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {currentTemplate?.id ? "Update Template" : "Create Template"}
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
                      {template.updatedAt}
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
                    No templates found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <strong>1-{filteredTemplates.length}</strong> of{" "}
            <strong>{templates.length}</strong> templates
          </div>
        </CardFooter>
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
