import React, { useEffect, useState } from "react";
import { isNative } from "../helpers/device";
import { isEqual } from "lodash";

const DEFAULT_LEMMY_SERVERS = ["lemmy.world"];

let _customServers = DEFAULT_LEMMY_SERVERS;

export function getCustomServers() {
  return _customServers;
}

export function getDefaultServer() {
  return _customServers[0]!;
}

export function defaultServersUntouched() {
  return isEqual(DEFAULT_LEMMY_SERVERS, getCustomServers());
}

async function getConfig() {
  if (isNative()) return;

  const response = await fetch("/_config");

  const { customServers } = await response.json();

  if (customServers?.length) {
    _customServers = customServers;
  }
}

// Only needs to be done once for app load
const config = getConfig();

interface ConfigProviderProps {
  children?: React.ReactNode;
}

export default function ConfigProvider({ children }: ConfigProviderProps) {
  const [configLoaded, setConfigLoaded] = useState(isNative()); // native does not load config

  useEffect(() => {
    // Config is not necessary for app to run
    config.finally(() => {
      setConfigLoaded(true);
    });
  }, []);

  if (configLoaded) return children;
}
