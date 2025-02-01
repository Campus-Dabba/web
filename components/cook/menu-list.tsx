"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Edit2, Trash2 } from "lucide-react";
import { MenuForm } from "./menu-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";


interface MenuItem {
  id: string;
  cook_id: string;
  item_name: string;
  description: string;
  price: number;
  meal_type: string;
  dietary_type: string;
  day_of_week: string;
}



export function MenuList() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [selectedItem, setSelectedItem] = useState<MenuItem | undefined>(undefined);

  const handleItemSelect = (item: MenuItem | null) => {
    setSelectedItem(item ?? undefined);
  };


  const handleUpdate = async (updatedItem: MenuItem) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("dabba_menu")
        .update({
          item_name: updatedItem.item_name,
          description: updatedItem.description,
          price: updatedItem.price,
          meal_type: updatedItem.meal_type,
          dietary_type: updatedItem.dietary_type,
          day_of_week: updatedItem.day_of_week,
        })
        .eq("id", updatedItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      setEditingItem(null);
      fetchMenuItems();
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const fetchMenuItems = async () => {
    try {
      const supabase = createClient();
      console.log("Supabase client created"); // Debug log

      const authResponse = await supabase.auth.getUser();
      console.log("Auth response:", authResponse); // Debug log

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("dabba_menu")
        .select("*")
        .eq("cook_id", user.id)
        .order("day_of_week", { ascending: true });

      console.log("Query response:", { data, error }); // Debug log

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("dabba_menu").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      fetchMenuItems();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  
  const getDayName = (day: number) => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return days[day - 1];
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);




  
  if (loading) {
    return <div className="text-center py-4">Loading menu items...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Meal Type</TableHead>
            <TableHead>Dietary Type</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No menu items found
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.item_name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="capitalize">{item.day_of_week}</TableCell>
                <TableCell className="capitalize">{item.meal_type}</TableCell>
                <TableCell className="capitalize">
                  {item.dietary_type}
                </TableCell>
                <TableCell className="text-right">₹{item.price}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Menu Item</DialogTitle>
                      </DialogHeader>
                      <MenuForm
                        initialData={editingItem}
                        onSuccess={() => {
                          setEditingItem(null);
                          fetchMenuItems();
                        }}
                        isEditing
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
