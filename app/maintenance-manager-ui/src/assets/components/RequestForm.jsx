import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import api from "../api";

export default function RequestForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Normal",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("MaintenanceRequests", form);
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-lg space-y-4">
      <h2 className="text-xl font-semibold">Nueva Solicitud</h2>

      <div>
        <Label>Título</Label>
        <Input name="title" onChange={handleChange} required />
      </div>

      <div>
        <Label>Descripción</Label>
        <Textarea name="description" onChange={handleChange} />
      </div>

      <div>
        <Label>Asignar a</Label>
        <Input name="assignedTo" onChange={handleChange} />
      </div>

      <div>
        <Label>Prioridad</Label>
        <Select
          onValueChange={(value) => setForm({ ...form, priority: value })}
          defaultValue="Normal"
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Baja">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Guardar</Button>
    </form>
  );
}