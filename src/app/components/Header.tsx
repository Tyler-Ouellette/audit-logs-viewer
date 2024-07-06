import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "@dynatrace/strato-components-preview";


export const Header = () => {
  return (
    <AppHeader>
      <AppHeader.NavItems>
        <AppHeader.AppNavLink as={Link} to="/" />
        <AppHeader.NavItem as={Link} to="/settingsAuditLogs">
          Settings Audit Logs
        </AppHeader.NavItem>
        <AppHeader.NavItem as={Link} to="/apiGatewayLogs">
          API Gateway Audit Logs
        </AppHeader.NavItem>
        <AppHeader.NavItem as={Link} to="/oldAuditLogs">
          Old API Audit Logs
        </AppHeader.NavItem>
      </AppHeader.NavItems>
    </AppHeader>
  );
};
