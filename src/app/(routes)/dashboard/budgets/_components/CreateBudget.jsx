"use client";
import React, { useState } from "react";
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
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { createBudget } from "src/actions";
import { Plus, Loader2 } from "lucide-react";

/**
 * CreateBudget Component
 * Dieter Rams: "Good design is thorough down to the last detail"
 */

function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("💰");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setName("");
    setAmount("");
    setEmojiIcon("💰");
    setOpenEmojiPicker(false);
  };

  /**
   * Used to Create New Budget
   */
  const onCreateBudget = async () => {
    if (!name.trim() || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createBudget(
        name.trim(),
        amount,
        user?.primaryEmailAddress?.emailAddress,
        emojiIcon
      );

      if (result?.success) {
        toast.success("Budget created successfully!");
        resetForm();
        setOpen(false);
        if (refreshData) {
          refreshData();
        }
      } else {
        toast.error(result?.error || "Failed to create budget");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            className="bg-card p-10 rounded-xl
            items-center flex flex-col border-2 border-dashed border-border
            cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h2 className="font-medium text-foreground">Create New Budget</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Set spending limits for categories
            </p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              Set a budget to track your spending in a specific category
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
                {emojiIcon}
              </Button>
              {openEmojiPicker && (
                <div className="absolute z-50 mt-2">
                  <EmojiPicker
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                    theme="light"
                    lazyLoadEmojis={true}
                    searchPlaceHolder="Search emoji..."
                  />
                </div>
              )}
            </div>

            {/* Budget Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Budget Name
              </label>
              <Input
                placeholder="e.g. Groceries, Entertainment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
              />
            </div>

            {/* Budget Amount */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Budget Amount ($)
              </label>
              <Input
                type="number"
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Monthly spending limit for this category
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={!(name.trim() && amount) || isLoading}
              onClick={onCreateBudget}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Budget"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;
