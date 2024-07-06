import { Page } from "@dynatrace/strato-components-preview";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { OldAuditLogs } from "./pages/OldAuditLogs";
import { GatewayLogs } from "./pages/GatewayLogs";
import { SettingsLogs } from "./pages/SettingsLogs";
import { Header } from "./components/Header";

export const App = () => {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<SettingsLogs />} />
          <Route path="/settingsAuditLogs" element={<SettingsLogs />} />
          <Route path="/apiGatewayLogs" element={<GatewayLogs />} />
          <Route path="/oldAuditLogs" element={<OldAuditLogs />} />
        </Routes>
      </Page.Main>
    </Page>
  );
};
