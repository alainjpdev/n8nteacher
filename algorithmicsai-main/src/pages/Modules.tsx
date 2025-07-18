import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

const Modules: React.FC = () => {
  const { t } = useTranslation();
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [edit, setEdit] = useState<{ title: string; description: string; url: string }>({ title: '', description: '', url: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/modules')
      .then(res => res.json())
      .then(data => {
        setModules(data);
        setLoading(false);
      });
  }, []);

  const openModal = (module: any) => {
    setSelected(module);
    setEdit({ title: module.title, description: module.description, url: module.url });
    setModalOpen(true);
    setError(null);
    setSuccessMsg(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setEdit({ title: '', description: '', url: '' });
    setError(null);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/modules/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edit)
      });
      if (!res.ok) throw new Error('Error al guardar');
      const updated = await res.json();
      setModules(modules => modules.map(m => m.id === selected.id ? updated : m));
      setSuccessMsg('¡Módulo actualizado correctamente!');
      setTimeout(() => { closeModal(); }, 1200);
    } catch (err) {
      setError('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm('¿Seguro que quieres eliminar este módulo?')) return;
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/modules/${selected.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setModules(modules => modules.filter(m => m.id !== selected.id));
      setSuccessMsg('¡Módulo eliminado correctamente!');
      setTimeout(() => { closeModal(); }, 1200);
    } catch (err) {
      setError('Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('adminDashboard.allModules', 'Todos los Módulos')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th> */}
                <th className="text-left py-3 px-4 font-medium text-gray-700">Título</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">URL</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500">{t('loading', 'Cargando...')}</td></tr>
              ) : modules.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500">{t('adminDashboard.noModules', 'No hay módulos')}</td></tr>
              ) : (
                modules.map(module => (
                  <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50">
                    {/* <td className="py-3 px-4">{module.id}</td> */}
                    <td className="py-3 px-4">{module.title}</td>
                    <td className="py-3 px-4">{module.description}</td>
                    <td className="py-3 px-4">
                      <a href={module.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{module.url}</a>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline" onClick={() => openModal(module)}>{t('adminDashboard.manage', 'Gestionar')}</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de gestión de módulo */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={closeModal}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">Gestionar Módulo</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={edit.title} onChange={e => setEdit(edit => ({ ...edit, title: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea className="w-full border rounded px-3 py-2" value={edit.description} onChange={e => setEdit(edit => ({ ...edit, description: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input type="text" className="w-full border rounded px-3 py-2" value={edit.url} onChange={e => setEdit(edit => ({ ...edit, url: e.target.value }))} />
            </div>
            <div className="mb-4 text-sm text-gray-500">
              <strong>ID:</strong> {selected.id}<br />
              <strong>Creado:</strong> {selected.createdAt || 'N/A'}
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}
            <div className="flex gap-2">
              <Button size="sm" variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
              <Button size="sm" variant="outline" onClick={handleDelete} disabled={saving}>Eliminar</Button>
              <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules; 