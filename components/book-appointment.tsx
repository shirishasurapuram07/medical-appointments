"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { useToast } from "@/components/ui/use-toast";
import { handleErrors } from "@/helpers/errors";
import { cn } from "@/lib/utils";
import { DoctorWithUser } from "@/types";
import axios from "axios";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface BookAppointmentProps {
  doctors: DoctorWithUser[];
}

export default function BookAppointment({ doctors }: BookAppointmentProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    doctorId: "",
    appointmentDate: new Date(),
  });
  const router = useRouter();
  const { toast } = useToast();

  function resetForm() {
    setForm({
      doctorId: "",
      appointmentDate: new Date(),
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/appointments", form);
      console.log(response.data);
    } catch (error) {
      const e = error as Error;
      handleErrors(e, toast);
    } finally {
      setLoading(false);
      setOpen(false);
      resetForm();
      router.refresh();
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        resetForm();
      }}
    >
      <DialogTrigger>
        <Button>Book Appointment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <form onSubmit={handleSubmit}>
            <DialogDescription>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="coupon-expiry" className="mt-4">
                  Doctor
                </Label>
                <Select
                  onValueChange={(value) =>
                    setForm({ ...form, doctorId: value })
                  }
                  defaultValue={form.doctorId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.user.displayName} - {doctor.speciality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DialogDescription>
            <DialogDescription>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="coupon-expiry" className="mt-4">
                  Appointment Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !form.appointmentDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.appointmentDate ? (
                        format(form.appointmentDate, "PPP HH:mm:ss")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.appointmentDate}
                      onSelect={(date) => {
                        if (!date) return;
                        setForm({ ...form, appointmentDate: date });
                      }}
                      initialFocus
                    />
                    <div className="border-border border-t p-3">
                      <TimePicker
                        setDate={(date) => {
                          if (!date) return;
                          setForm({ ...form, appointmentDate: date });
                        }}
                        date={form.appointmentDate}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </DialogDescription>
            <DialogFooter>
              <div className="flex gap-4">
                <Button
                  variant="destructive"
                  className="mt-4"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  loading={loading}
                  type="submit"
                  className="mt-4"
                >
                  Add
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
