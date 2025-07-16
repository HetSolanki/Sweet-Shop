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
import { Button } from "@/components/ui/button";
import { deleteSweet } from "@/lib/api";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AlertDialogBox({ sweetId }: { sweetId: string }) {
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    const res = await deleteSweet(sweetId);
    if (res.status === 200) {
      toast.success(res.message);
      setOpen(false);
      location.reload();
    } else {
      toast.custom(() => (
        <div
          className="w-full max-w-sm bg-red-500 border border-destructive rounded-md shadow-lg p-4 flex items-start gap-3"
          role="alert"
        >
          <AlertTriangle className="text-white h-5 w-5" />
          <div className="">
            <p className="text-sm text-white">{res.error}</p>
          </div>
        </div>
      ));
    }
  };
  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete sweet?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
