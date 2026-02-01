"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EmojiPicker from "emoji-picker-react";
import { useRouter } from "next/navigation";
import { deleteIncome, updateIncome } from "src/actions";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2, DollarSign } from "lucide-react";

/**
 * IncomeItem Component
 * Dieter Rams: "Good design is aesthetic"
 */

function IncomeItem({ budget, onRefresh }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(budget.name);
  const [editAmount, setEditAmount] = useState(budget.amount);
  const [editIcon, setEditIcon] = useState(budget.icon || "💰");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteIncome(budget.id);
      if (result.success) {
        toast.success("Income deleted successfully");
        router.refresh();
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.error || "Failed to delete income");
      }
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = async () => {
    if (!editName.trim() || !editAmount) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isNaN(Number(editAmount)) || Number(editAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsEditing(true);
    try {
      const result = await updateIncome(
        budget.id,
        editName.trim(),
        editAmount,
        editIcon
      );
      if (result.success) {
        toast.success("Income updated successfully");
        setEditOpen(false);
        router.refresh();
        if (onRefresh) onRefresh();
      } else {
        toast.error(result.error || "Failed to update income");
      }
    } catch (error) {
      console.error("Error updating income:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsEditing(false);
    }
  };

  const resetEditForm = () => {
    setEditName(budget.name);
    setEditAmount(budget.amount);
    setEditIcon(budget.icon || "💰");
    setOpenEmojiPicker(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center bg-income/10 rounded-xl text-2xl">
              {budget?.icon || "💰"}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{budget.name}</h3>
              <p className="text-sm text-muted-foreground">Income Stream</p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-income" />
          <span className="text-2xl font-bold text-income">
            {Number(budget.amount).toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-border">
          {/* Edit Dialog */}
          <Dialog
            open={editOpen}
            onOpenChange={(open) => {
              setEditOpen(open);
              if (!open) resetEditForm();
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Income</DialogTitle>
                <DialogDescription>
                  Update your income stream details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Emoji Picker */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Icon</label>
                  <Button
                    variant="outline"
                    className="text-2xl h-14 w-14"
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    {editIcon}
                  </Button>
                  {openEmojiPicker && (
                    <div className="absolute z-50 mt-2">
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          setEditIcon(e.emoji);
                          setOpenEmojiPicker(false);
                        }}
                        theme="light"
                        lazyLoadEmojis={true}
                      />
                    </div>
                  )}
                </div>

                {/* Income Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Income Name
                  </label>
                  <Input
                    placeholder="e.g. Salary, Freelance"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    maxLength={50}
                  />
                </div>

                {/* Income Amount */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monthly Amount ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button variant="outline" disabled={isEditing}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={handleEdit}
                  disabled={isEditing || !(editName.trim() && editAmount)}
                >
                  {isEditing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Income Source</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{budget.name}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default IncomeItem;
