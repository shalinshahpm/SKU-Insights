import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { SKU } from "@/lib/types";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { PlusCircle, MoreVertical, Store, Trash, Upload, FileUp, Download } from "lucide-react";
import { z } from "zod";
import { SKUUploader } from "@/components/workflow/SKUUploader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const regions = ["UK", "US", "India", "Brazil", "Germany", "France", "Japan", "China", "Australia"];
const markets = ["Amazon", "Walmart", "Carrefour", "Target", "Tesco", "Alibaba"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "SKU name must be at least 2 characters.",
  }),
  brand: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  region: z.string().min(1, {
    message: "Please select a region.",
  }),
  market: z.string().min(1, {
    message: "Please select a market.",
  }),
});

export default function SKUManagement() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSKU, setSelectedSKU] = useState<SKU | null>(null);

  // Fetch SKUs from API
  const { data: skus = [], isLoading } = useQuery<SKU[]>({
    queryKey: ["/api/skus"],
  });

  // Form for adding new SKU
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "Nestlé",
      region: "",
      market: "",
    },
  });

  // Add SKU mutation
  const addSKUMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/skus", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skus"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "SKU Added",
        description: "The SKU has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add SKU. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete SKU mutation
  const deleteSKUMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/skus/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skus"] });
      setDeleteDialogOpen(false);
      setSelectedSKU(null);
      toast({
        title: "SKU Deleted",
        description: "The SKU has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete SKU. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission for adding new SKU
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addSKUMutation.mutate(values);
  };

  // Handle delete SKU
  const handleDeleteSKU = (sku: SKU) => {
    setSelectedSKU(sku);
    setDeleteDialogOpen(true);
  };

  // Confirm delete SKU
  const confirmDeleteSKU = () => {
    if (selectedSKU) {
      deleteSKUMutation.mutate(selectedSKU.id);
    }
  };

  return (
    <MainLayout
      pageTitle="SKU Management"
      pageDescription="Manage all your tracked SKUs across regions and markets"
    >
      {/* SKU Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            SKU Upload Center
          </CardTitle>
          <CardDescription>
            Upload multiple SKUs at once or add individual products to your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SKUUploader />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">Existing SKUs</h2>
          <p className="text-sm text-muted-foreground">Manage your product portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New SKU
              </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New SKU</DialogTitle>
              <DialogDescription>
                Add a new SKU to track across markets and regions.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU Name</FormLabel>
                      <FormControl>
                        <Input placeholder="KitKat Original" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Nestlé" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a market" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {markets.map((market) => (
                            <SelectItem key={market} value={market}>
                              {market}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={addSKUMutation.isPending}
                  >
                    {addSKUMutation.isPending ? "Adding..." : "Add SKU"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
      </Dialog>

      {/* SKU List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="mr-2 h-5 w-5" />
            Product SKUs
          </CardTitle>
          <CardDescription>
            Manage and track your SKUs across different markets and regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead>Added Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Store className="h-12 w-12 mb-2 opacity-30" />
                        <p>No SKUs found</p>
                        <Button
                          variant="link"
                          onClick={() => setIsAddDialogOpen(true)}
                          className="mt-2"
                        >
                          Add your first SKU
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  skus.map((sku) => (
                    <TableRow key={sku.id}>
                      <TableCell className="font-medium">{sku.name}</TableCell>
                      <TableCell>{sku.brand}</TableCell>
                      <TableCell>{sku.region}</TableCell>
                      <TableCell>{sku.market}</TableCell>
                      <TableCell>
                        {format(new Date(sku.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteSKU(sku)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            {skus.length} SKUs total
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete SKU</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this SKU? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedSKU && (
              <div className="bg-muted p-3 rounded-md">
                <p><span className="font-medium">Name:</span> {selectedSKU.name}</p>
                <p><span className="font-medium">Brand:</span> {selectedSKU.brand}</p>
                <p><span className="font-medium">Region:</span> {selectedSKU.region}</p>
                <p><span className="font-medium">Market:</span> {selectedSKU.market}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteSKU}
              disabled={deleteSKUMutation.isPending}
            >
              {deleteSKUMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
