import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  condition: z.string().min(1, "Please select a condition"),
  notes: z.string().optional(),
  bed: z.string().optional(),
});

interface BedAssignmentModalProps {
  bedId: string;
  bedNumber: string;
  onClose: () => void;
  onAssign: (data: z.infer<typeof formSchema>) => void;
  error : string
}

export default function BedAssignmentModal({
  bedId,
  bedNumber,
  onClose,
  onAssign,
  error
}: BedAssignmentModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      condition: "",
      notes: "",
      bed: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onAssign(data);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Bed {bedNumber}</DialogTitle>
        </DialogHeader>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName">Bed Number</Label>
            <Input
              id="patientName"
              {...form.register("bed")}
              placeholder="Enter Bed Number"
            />
            {form.formState.errors.bed && (
              <p className="text-sm text-red-500">
                {form.formState.errors.bed.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Medical Condition</Label>
            <Input
              id="condition"
              {...form.register("condition")}
              placeholder="Enter Condition"
            />
            {form.formState.errors.condition && (
              <p className="text-sm text-red-500">
                {form.formState.errors.condition.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Enter any additional notes"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Assign Bed</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
