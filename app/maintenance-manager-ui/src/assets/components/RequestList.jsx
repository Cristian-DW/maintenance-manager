import { useEffect, useState } from "react";
import api from "../../api";
import { Card, CardContent } from "";

export default function RequestList() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const res = await api.get("MaintenanceRequests");
    setRequests(res.data.value);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 grid gap-4">
      {requests.map((r) => (
        <Card key={r.ID}>
          <CardContent className="p-4 flex flex-col">
            <h3 className="text-lg font-semibold">{r.title}</h3>
            <p className="text-sm text-gray-500">{r.description}</p>
            <div className="flex justify-between mt-2 text-sm">
              <span>🧑 {r.assignedTo || "Sin asignar"}</span>
              <span>⏱️ {r.status}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}