import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Filter } from 'lucide-react';
import { useTramites } from '../../context/TramitesContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReportsView: React.FC = () => {
  const { tramites } = useTramites();
  const [filtroDelegado, setFiltroDelegado] = useState('TODOS');
  const [filtroModalidad, setFiltroModalidad] = useState('TODAS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');

  // Filtrado de reportes
  const tramitesReporte = tramites.filter((t) => {
    if (filtroDelegado !== 'TODOS' && t.delegado !== filtroDelegado) return false;
    if (filtroModalidad !== 'TODAS' && t.modalidad !== filtroModalidad) return false;
    if (filtroEstado !== 'TODOS' && t.estado !== filtroEstado) return false;
    return true;
  });

  // Exportar a Excel profesional
  const exportarExcel = () => {
    const dataExcel = tramitesReporte.map((t) => ({
      'N.º Correlativo': t.numero,
      'Nombre Completo': t.nombreCompleto,
      'Cédula de Identidad': t.cedulaIdentidad,
      'Flujo': t.flujo,
      'Modalidad': t.modalidad,
      'Qué está corrigiendo': t.queEstaCorrigiendo,
      'Detalle': t.detalleCorreccion,
      'Delegado Asignado': t.delegado,
      'Estado': t.estado,
      'Fecha Recepción': t.fechaRecepcion,
      'Fecha Finalización': t.fechaFinalizacion || 'N/A',
      'Registrado Por': t.usuarioRegistro,
      'Finalizado Por': t.usuarioFinalizo || 'N/A',
      'Observaciones': t.observaciones || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trámites Saneamiento');

    // Generar archivo y descargar
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `SEGIP_Reporte_Gabinete_Juridico_${fecha}.xlsx`);
  };

  // Exportar a PDF oficial membretado
  const exportarPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Membrete institucional
    doc.setFontSize(14);
    doc.setTextColor(10, 56, 113); // Azul SEGIP
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICIO GENERAL DE IDENTIFICACIÓN PERSONAL - SEGIP', 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text('Gabinete Jurídico | Reporte Oficial de Seguimiento de Saneamiento de Datos', 14, 21);

    const fechaHoy = new Date().toLocaleDateString('es-BO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    doc.text(`Fecha de emisión: ${fechaHoy}`, 14, 27);

    // Tabla con autoTable
    const tableRows = tramitesReporte.map((t) => [
      t.numero,
      t.nombreCompleto,
      t.cedulaIdentidad,
      t.modalidad,
      t.queEstaCorrigiendo,
      t.delegado,
      t.estado,
      t.fechaRecepcion,
      t.fechaFinalizacion || '-',
    ]);

    autoTable(doc, {
      startY: 32,
      head: [
        [
          'N.º',
          'Usuario',
          'C.I.',
          'Modalidad',
          'Corrección',
          'Delegado',
          'Estado',
          'Recepción',
          'Finalización',
        ],
      ],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [10, 56, 113],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8,
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    const fecha = new Date().toISOString().split('T')[0];
    doc.save(`SEGIP_Reporte_Gabinete_Juridico_${fecha}.pdf`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Cabecera del módulo */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Reportes y Estadísticas Oficiales
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Generación de planillas de control para auditoría del Gabinete Jurídico
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportarExcel}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Excel</span>
          </button>

          <button
            type="button"
            onClick={exportarPDF}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Filtros de exportación */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-bold">
          <Filter className="w-4 h-4 text-segip-600" />
          <span>Filtros de reporte:</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Delegado:</span>
          <select
            value={filtroDelegado}
            onChange={(e) => setFiltroDelegado(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
          >
            <option value="TODOS">Todos los delegados</option>
            <option value="Maycol Ávila">Maycol Ávila</option>
            <option value="Ximena Veliz">Ximena Veliz</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Modalidad:</span>
          <select
            value={filtroModalidad}
            onChange={(e) => setFiltroModalidad(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
          >
            <option value="TODAS">Todas las modalidades</option>
            <option value="Consolidado">Consolidado</option>
            <option value="No consolidado">No consolidado</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Estado:</span>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 cursor-pointer"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="FINALIZADO">Finalizados</option>
          </select>
        </div>

        <div className="ml-auto font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
          {tramitesReporte.length} registros seleccionados
        </div>
      </div>

      {/* Previsualización de datos para el reporte */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-700">
          Vista previa del reporte tabulado
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-4">N.º</th>
                <th className="py-2.5 px-4">Usuario</th>
                <th className="py-2.5 px-4">C.I.</th>
                <th className="py-2.5 px-4">Modalidad</th>
                <th className="py-2.5 px-4">Corrección</th>
                <th className="py-2.5 px-4">Delegado</th>
                <th className="py-2.5 px-4">Estado</th>
                <th className="py-2.5 px-4">Recepción</th>
                <th className="py-2.5 px-4">Finalización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tramitesReporte.slice(0, 15).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="py-2 px-4 font-mono font-bold text-slate-500">{t.numero}</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">{t.nombreCompleto}</td>
                  <td className="py-2 px-4 font-mono text-slate-600">{t.cedulaIdentidad}</td>
                  <td className="py-2 px-4">{t.modalidad}</td>
                  <td className="py-2 px-4 text-slate-700">{t.queEstaCorrigiendo}</td>
                  <td className="py-2 px-4">{t.delegado}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.estado === 'PENDIENTE'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {t.estado}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-slate-500">{t.fechaRecepcion}</td>
                  <td className="py-2 px-4 text-slate-500">{t.fechaFinalizacion || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
