import { useState } from "react";
import Layout from "./assets/components/layout";
import RequestForm from "./assets/components/RequestForm";
import RequestList from "./assets/components/RequestList";

export default function App() {
  const [reload, setReload] = useState(false);

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-6">
        <RequestForm onCreated={() => setReload(!reload)} />
        <RequestList key={reload} />
      </div>
    </Layout>
  );
}