import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../services/api';

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
    apiClient.get('/api/modules')
      .then(res => {
        setModules(res.data);
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
      const res = await apiClient.put(`/api/modules/${selected.id}`, edit);
      const updated = res.data;
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
      await apiClient.delete(`/api/modules/${selected.id}`);
      setModules(modules => modules.filter(m => m.id !== selected.id));
      setSuccessMsg('¡Módulo eliminado correctamente!');
      setTimeout(() => { closeModal(); }, 1200);
    } catch (err) {
      setError('Error al eliminar');
    } finally {
      setSaving(false);
    }
  };

  // Agregar función para crear módulo
  const openCreateModal = () => {
    setSelected(null);
    setEdit({ title: '', description: '', url: '' });
    setModalOpen(true);
    setError(null);
    setSuccessMsg(null);
  };

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await apiClient.post('/api/modules', edit);
      const created = res.data;
      setModules(modules => [...modules, created]);
      setSuccessMsg('¡Módulo creado correctamente!');
      setTimeout(() => { closeModal(); }, 1200);
    } catch (err) {
      setError('Error al crear');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text mb-6 flex items-center justify-between">
        {t('adminDashboard.allModules', 'Todos los Módulos')}
        <Button size="sm" variant="primary" onClick={openCreateModal}>{t('adminDashboard.createModule', 'Crear Módulo')}</Button>
      </h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th> */}
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Título</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">URL</th>
                {/* <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="py-6 text-center text-text-secondary">{t('loading', 'Cargando...')}</td></tr>
              ) : modules.length === 0 ? (
                <tr><td colSpan={3} className="py-6 text-center text-text-secondary">{t('adminDashboard.noModules', 'No hay módulos')}</td></tr>
              ) : (
                modules.map(module => (
                  <tr key={module.id} className="border-b border-border hover:bg-panel">
                    {/* <td className="py-3 px-4">{module.id}</td> */}
                    <td className="py-3 px-4">{module.title}</td>
                    <td className="py-3 px-4">{module.description}</td>
                    <td className="py-3 px-4">
                      <a href={module.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{module.url}</a>
                    </td>
                    {/* <td className="py-3 px-4">
                      <Button size="sm" variant="outline" onClick={() => openModal(module)}>{t('adminDashboard.manage', 'Gestionar')}</Button>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de gestión de módulo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-panel rounded-lg shadow-2xl p-8 w-full max-w-md border border-border relative">
            <button className="absolute top-2 right-2 text-text-secondary hover:text-text" onClick={closeModal}>&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-text">{selected ? 'Gestionar Módulo' : 'Crear Módulo'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">Título</label>
              <input type="text" className="w-full border border-border rounded px-3 py-2 bg-panel text-text focus:outline-none focus:ring-2 focus:ring-primary" value={edit.title} onChange={e => setEdit(edit => ({ ...edit, title: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">Descripción</label>
              <textarea className="w-full border border-border rounded px-3 py-2 bg-panel text-text focus:outline-none focus:ring-2 focus:ring-primary" value={edit.description} onChange={e => setEdit(edit => ({ ...edit, description: e.target.value }))} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-1">URL</label>
              <input type="text" className="w-full border border-border rounded px-3 py-2 bg-panel text-text focus:outline-none focus:ring-2 focus:ring-primary" value={edit.url} onChange={e => setEdit(edit => ({ ...edit, url: e.target.value }))} />
            </div>
            {selected && (
              <div className="mb-4 text-sm text-text-secondary">
                <strong>ID:</strong> {selected.id}<br />
                <strong>Creado:</strong> {selected.createdAt || 'N/A'}
              </div>
            )}
            {error && <div className="text-error mb-2">{error}</div>}
            {successMsg && <div className="text-success mb-2">{successMsg}</div>}
            <div className="flex gap-2">
              {selected ? (
                <>
                  <Button size="sm" variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</Button>
                  <Button size="sm" variant="outline" onClick={handleDelete} disabled={saving}>Eliminar</Button>
                </>
              ) : (
                <Button size="sm" variant="primary" onClick={handleCreate} disabled={saving}>{saving ? 'Creando...' : 'Crear'}</Button>
              )}
              <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules; 