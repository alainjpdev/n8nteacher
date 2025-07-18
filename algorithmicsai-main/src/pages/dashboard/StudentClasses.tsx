import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { useTranslation } from 'react-i18next';

const StudentClasses: React.FC = () => {
  const { t } = useTranslation();
  const [studentclasses, setStudentClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/studentclasses')
      .then(res => res.json())
      .then(data => {
        setStudentClasses(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('adminDashboard.studentClasses', 'Inscripciones de Estudiantes')}</h1>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estudiante</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Clase</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha de Inscripción</th>
              </tr>
            </thead>
            <tbody>
              {studentclasses.map(sc => (
                <tr key={sc.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{sc.student.firstName} {sc.student.lastName}</td>
                  <td className="py-3 px-4">{sc.student.email}</td>
                  <td className="py-3 px-4">{sc.class.title}</td>
                  <td className="py-3 px-4">{t('enrollmentStatus.' + sc.status, { defaultValue: sc.status })}</td>
                  <td className="py-3 px-4">{new Date(sc.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StudentClasses; 