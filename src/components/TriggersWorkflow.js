import React, { useEffect, useMemo, useState, useCallback } from 'react';

const TriggersWorkflow = ({ isVisible, onClose }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [copyOk, setCopyOk] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/data/triggers.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo cargar triggers.json');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || 'Error cargando triggers');
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchData();
    }
  }, [isVisible, fetchData]);

  const workflow = useMemo(() => {
    if (!data?.triggers) return null;
    return {
      name: data.workflowTitle || 'Workflow de Triggers',
      updatedAt: data.updatedAt || new Date().toISOString(),
      nodes: data.triggers.map((t, index) => ({
        id: `node_${index + 1}`,
        label: t.name,
        key: t.key,
        category: t.category,
        difficulty: t.difficulty,
        position: { x: 140 + (index % 3) * 220, y: 120 + Math.floor(index / 3) * 140 }
      })),
      meta: {
        source: 'public/data/triggers.json',
        count: data.triggers.length
      }
    };
  }, [data]);

  const copyWorkflowJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    } catch (e) {
      setCopyOk(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Workflow de Triggers</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {error && (
          <div className="p-3 mb-3 bg-red-900/30 border border-red-700 text-red-200 rounded">{error}</div>
        )}

        {!data && !error && (
          <div className="text-gray-300">Cargando...</div>
        )}

        {data && (
          <>
            <div className="mb-4">
              <div className="text-white text-lg font-semibold">{data.workflowTitle}</div>
              <div className="text-gray-400 text-sm">Actualizado: {data.updatedAt}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              {data.triggers.map((t) => (
                <div key={t.id} className="bg-gray-800 border border-gray-700 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium">{t.name}</div>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">{t.difficulty}</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-2">{t.description}</div>
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                    <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700">{t.category}</span>
                    <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-300 border border-gray-600">{t.key}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-300 text-xs space-y-1 mb-3">
                    {t.useCases?.map((u, idx) => (
                      <li key={idx}>{u}</li>
                    ))}
                  </ul>
                  {t.docsUrl && (
                    <a href={t.docsUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 underline">Ver docs</a>
                  )}
                </div>
              ))}
            </div>

            {workflow && (
              <div className="bg-gray-800 border border-gray-700 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-medium">Workflow generado (preview)</div>
                  <button onClick={copyWorkflowJson} className="text-xs px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
                    {copyOk ? '✅ Copiado' : '📋 Copiar JSON'}
                  </button>
                </div>
                <pre className="text-xs text-gray-200 whitespace-pre-wrap overflow-x-auto bg-gray-900 p-3 rounded border border-gray-700 max-h-64">{JSON.stringify(workflow, null, 2)}</pre>
                <div className="text-gray-400 text-xs mt-2">
                  Nota: Este es un esquema simplificado para referencia visual. Puedes copiarlo y adaptarlo para importarlo en n8n.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TriggersWorkflow;
