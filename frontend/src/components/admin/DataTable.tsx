/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteUser, useEditUser } from "@/hooks/useAdmin";
import type { EditUser } from "@/shared/types";
import { ShowStocksDialog } from "./ShowStocksDialog";
import { ShowScheduleDialog } from "./ShowScheduleDialog";
import Loader from "../ui/Loader";

export function DataTable({
  data,
  columns,
  detailer = false,
}: {
  data: any[];
  columns: { key: string; label: string }[];
  detailer?: boolean;
}) {
  const { editUserMutation, isEditingUser } = useEditUser();
  const { deleteUserMutation, isDeletingUser } = useDeleteUser();
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<EditUser | null>({
    id: "",
    name: "",
    email: "",
    phone: "",
  });

  const handleSaveEdit = () => {
    if (editForm) {
      editUserMutation(editForm);
      setEditForm(null);
      setSelectedRow(null);
    }
  };

  const handleConfirmDelete = () => {
    if (selectedRow) {
      deleteUserMutation(
        { id: selectedRow.id },
        {
          onSuccess: () => setSelectedRow(null),
        }
      );
    }
  };

  if (isEditingUser || isDeletingUser) return <Loader />;

  return (
    <Table className="text-center bg-muted/50">
      <TableHeader className="bg-muted/50 font-bold">
        <TableRow>
          {columns.map((col: { key: string; label: string }) => (
            <TableCell key={col.key}>{col.label}</TableCell>
          ))}
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row: any) => (
          <TableRow key={row.id}>
            {columns.map((col: any) => (
              <TableCell key={col.key}>{row[col.key]}</TableCell>
            ))}
            <TableCell className="flex justify-center">
              <div className="flex gap-2">
                {/* Delete Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setSelectedRow(row)}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to delete?
                      </DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={handleConfirmDelete}
                      >
                        Confirm Delete
                      </Button>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => {
                        setSelectedRow(row);
                        setEditForm({
                          id: row.id,
                          name: row.name,
                          email: row.email,
                          phone: row.phone,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Entry</DialogTitle>
                    </DialogHeader>
                    {editForm &&
                      columns.map((col: { key: string; label: string }) => (
                        <div key={col.key} className="mb-2">
                          <Label>{col.label}</Label>
                          <Input
                            value={editForm[col.key] || ""}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                [col.key]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ))}
                    <DialogFooter className="flex gap-2">
                      <Button onClick={handleSaveEdit}>Save</Button>
                      <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Show Schedule Dialog (only for detailer) */}
                {detailer && <ShowScheduleDialog row={row} />}

                {/* Show Stocks Dialog (only for detailer)*/}
                {detailer && <ShowStocksDialog row={row} />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
