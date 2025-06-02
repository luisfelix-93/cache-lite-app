import { useEffect, useState } from "react";
import { useCache } from "../../context/CacheContext"

export default function Home() {
    const { logs, send, connect, isConnected, disconnect, ip, port, keys} = useCache();
    const [ command , setCommand ] = useState<string>("");
    const [seconds, setSeconds] = useState<number>(0);
    
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isConnected) {
            setSeconds(0);
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isConnected]);
    
    const handleSend = () => {
        if (command.trim()) {
            send(command.trim());
            setCommand('');
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    }
    
    const handlReconnect = () => {
        if (ip && port) {
            connect(ip, port);
        }
    }
    
    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    return(
        <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Console do Servidor de Cache</h1>
        
        <div className="flex items-center space-x-4">
        {/* Indicador com tooltip */}
        <div className="relative group cursor-default">
        <span
        className={`h-3 w-3 rounded-full ${
            isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
        }`}
        />
        <div className="absolute top-6 right-0 bg-white border text-xs text-gray-700 px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition">
        {isConnected ? `Conectado a ${ip}:${port}` : "Desconectado"}
        </div>
        </div>
        
        {/* Timer */}
        <span className="text-sm text-gray-700">
        {isConnected ? `Tempo conectado: ${formatTime(seconds)}` : "Offline"}
        </span>
        
        {/* Botão reconectar */}
        {!isConnected && ip && port && (
            <button
            onClick={handlReconnect}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
            >
            Reconectar
            </button>
        )}
        </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
        <input
        type="text"
        placeholder="Digite um comando..."
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyPress}
        className="flex-1 border border-gray-300 rounded px-4 py-2 shadow-sm"
        disabled={!isConnected}
        />
        <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={!isConnected}
        >
        Enviar
        </button>
        <button
        onClick={disconnect}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
        Desconectar
        </button>
        
        <button
        onClick={() => send("KEYS")}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-4"
        >
        Listar Chaves
        </button>
        </div>
        
        <div className="bg-black text-green-400 p-4 rounded h-80 overflow-y-auto font-mono text-sm shadow-inner">
        {logs.length === 0 ? (
            <div className="text-gray-500">Nenhuma mensagem ainda...</div>
        ) : (
            logs.map((line, index) => <div key={index}>{line}</div>)
        )}
        </div>
        <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">🔑 Chaves Armazenadas</h2>
        {keys.length === 0 ? (
            <div className="text-gray-500">Nenhuma chave encontrada.</div>
        ) : (
            <ul className="bg-white border rounded shadow-sm divide-y">
            {keys.map((key, i) => (
                <li key={i} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                {key}
                </li>
            ))}
            </ul>
        )}
        </div>
        
        </div>
    )
}