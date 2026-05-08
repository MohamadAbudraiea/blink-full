import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AddUser } from "@/shared/types";
import { useAddUser } from "@/hooks/useAdmin";
import { Eye, EyeOff } from "lucide-react";
import Loader from "../ui/Loader";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { isValidPhone } from "@/shared/phoneUtils";

export function DetailerForm() {
  const { addUserMutation, isAddingUser } = useAddUser();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPhone(form.phone)) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    setPhoneError("");

    const newDetailer: AddUser = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      type: "detailer",
    };
    addUserMutation(newDetailer);
    setForm({ name: "", email: "", phone: "", password: "" });
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  if (isAddingUser) return <Loader />;

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex gap-4 mb-4 md:items-end md:flex-row flex-col items-start"
      >
        <div className="flex-1 w-full">
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border-primary w-full"
            autoComplete="name"
            minLength={3}
          />
        </div>
        <div className="flex-1 w-full">
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="border-primary w-full"
            autoComplete="email"
          />
        </div>
        <div className="flex-1 w-full relative">
          <Label>Password</Label>
          <Input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="border-primary w-full"
            autoComplete="new-password webauthn"
            minLength={6}
          />
          <Button
            type="button"
            onClick={handleShowPassword}
            className="absolute size-3 right-2 top-6 bg-transparent hover:bg-transparent hover:text-primary transition-colors"
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </Button>
        </div>
        <div className="flex-1 w-full">
          <Label>Phone</Label>
          <PhoneInput
            value={form.phone}
            onChange={(val) => {
              setForm({ ...form, phone: val });
              if (phoneError) setPhoneError("");
            }}
            error={!!phoneError}
          />
          {phoneError && (
            <p className="text-xs text-destructive mt-1">{phoneError}</p>
          )}
        </div>
        <Button type="submit" className="flex-1 w-full">
          Add Detailer
        </Button>
      </form>
    </div>
  );
}
