import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import { useAuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";
