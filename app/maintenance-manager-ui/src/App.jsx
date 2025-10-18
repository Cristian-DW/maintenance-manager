import { useState } from "react";
import Layout from "./components/Layout";
import RequestForm from "./components/RequestForm";
import RequestList from "./components/RequestList";

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