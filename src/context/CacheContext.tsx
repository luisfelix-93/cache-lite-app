import { createContext, useContext, useRef, useState } from "react";

interface CacheContextType {
    logs: string[];
    isConnected: boolean;
    connect: (ip: string, port: number) => void;
    send: (cmd: string) => void;
    disconnect: () => void;
    ip?: string;
    port?: number
    keys: string[]
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [ip, setIp] = useState<string>();
    const [port, setPort] = useState<number>();
    const [keys, setKeys] = useState<string[]>([]); // Adicionando estado para chaves

    const socketRef = useRef<WebSocket | null>(null);


    const connect = (ip: string, port: number) => {
        setIp(ip);
        setPort(port);
        const url = `ws://${ip}:${port}`;
        const ws = new WebSocket(url);
        socketRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            setLogs((prevLogs) => [...prevLogs, "Connected to WebSocket"]);
        };

        ws.onmessage = (event) => {
            setLogs((prevLogs) => [...prevLogs, `Message received: ${event.data}`]);
            // Verifica se a mensagem é uma lista de chaves
            if (event.data.startsWith("keys:")) {
                const receivedKeys = event.data.replace("keys:", "").split(",");
                setKeys(receivedKeys);
                setLogs((prevLogs) => [...prevLogs, `Chaves recebidas: ${receivedKeys.join(", ")}`]);
            }
        };

        ws.onerror = (err) => {
            console.log("Erro WebSocket:", err);
            setLogs((prevLogs) => [...prevLogs, `[erro ao conectar]`]);
        };

        ws.onclose = () => {
            setIsConnected(false);
            setLogs((prevLogs) => [...prevLogs, "WebSocket connection closed"]);
        };
    };

    const send = (cmd: string) => {
        if (cmd.toLowerCase() === "clear") {
            setLogs([]);
            return;
        }
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(cmd);
            setLogs((prevLogs) => [...prevLogs, `<-${cmd}`]);
        } else {
            setLogs((prevLogs) => [...prevLogs, '[erro: conexão não está aberta]']);
        }
    };

    const disconnect = () => {
        socketRef.current?.close();
        socketRef.current = null;
        setIsConnected(false);
        setLogs((prev) => [...prev, "🔌 Conexão encerrada manualmente"]);
  };

    return (
        <CacheContext.Provider value={{ 
            logs, 
            isConnected, 
            connect, 
            send, 
            disconnect,
            ip,
            port,
            keys
            }}>
            {children}
        </CacheContext.Provider>
    )
};

export const useCache = () => {
    const ctx = useContext(CacheContext);
    if (!ctx) throw new Error("useCache deve ser usado dentro do CacheProvider");
    return ctx;
}