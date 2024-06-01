import { Page } from "@dynatrace/strato-components-preview";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuditLogs } from "./pages/AuditLogs";
import { Header } from "./components/Header";

export const App = () => {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<AuditLogs />} />
          <Route path="/auditLogs" element={<AuditLogs />} />
        </Routes>
      </Page.Main>
    </Page>
  );
};
