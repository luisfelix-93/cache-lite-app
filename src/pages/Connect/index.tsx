import { useState } from "react";
import { useCache } from "../../context/CacheContext";

export default function Connect() {
    const { connect } = useCache();
    const [ ip, setIp ] = useState<string>("localhost");
    const [ port, setPort ] = useState<string>("");

    const handleConnect = () => {
        connect(ip, port ? parseInt(port) : 8080);
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2x1 font-bold mb-4">Conectar ao servidor de cache</h1>

            <div className="mb-4">
                <input 
                    type="text"
                    placeholder="IP (ex:127.0.0.1)"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    className="ml-2"
                />
                <input 
                    type="text"
                    placeholder="Porta (ex: 8080)"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    className="ml-2"
                />

                <button
                    onClick={handleConnect}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                    Conectar
                </button>
            </div>
        </div>
    )
}