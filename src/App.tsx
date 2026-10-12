import React, { useState } from 'react';
import { TramitesProvider, useTramites } from './context/TramitesContext';
import { Sidebar } from './components/layout/Sidebar';
import type { TabId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { WelcomeSyncBanner } from './components/dashboard/WelcomeSyncBanner';
import { MetricCards } from './components/dashboard/MetricCards';
import { FilterBar } from './components/tramites/FilterBar';
import { TramitesTable } from './components/tramites/TramitesTable';
import { RecentActivityPanel } from './components/dashboard/RecentActivityPanel';
import { DelegateStatsPanel } from './components/dashboard/DelegateStatsPanel';
import { InstitutionalFooter } from './components/layout/InstitutionalFooter';
import { ModalConfirmarFinalizacion } from './components/tramites/ModalConfirmarFinalizacion';
import { ModalRegistroTramite } from './components/tramites/ModalRegistroTramite';
import { ModalDetalleTramite } from './components/tramites/ModalDetalleTramite';
import { ReportsView } from './components/reports/ReportsView';
import { UsersView } from './components/users/UsersView';
import { ConfigView } from './components/config/ConfigView';

// Componentes dedicados para experiencia Mobile-First
import { MobileHeader } from './components/mobile/MobileHeader';
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { MobileHomeView } from './components/mobile/MobileHomeView';
import { MobileTramitesListView } from './components/mobile/MobileTramitesListView';
import { MobileRegisterWizard } from './components/mobile/MobileRegisterWizard';
import { MobileDetailView } from './components/mobile/MobileDetailView';
import { MobileMenuDrawer } from './components/mobile/MobileMenuDrawer';

import type { Tramite } from './types';
import { AlertCircle, X } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { tramitesFiltrados, finalizarTramite, mensajeError, limpiarError } = useTramites();

  const [tabActiva, setTabActiva] = useState<TabId>('dashboard');
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);
  const [tramiteAFinalizar, setTramiteAFinalizar] = useState<Tramite | null>(null);
  const [tramiteDetalle, setTramiteDetalle] = useState<Tramite | null>(null);

  // Estados específicos de móvil
  const [drawerMenuAbierto, setDrawerMenuAbierto] = useState(false);
  const [mobileWizardAbierto, setMobileWizardAbierto] = useState(false);
  const [mobileDetalleTramite, setMobileDetalleTramite] = useState<Tramite | null>(null);

  const handleCambiarTab = (tab: TabId) => {
    if (tab === 'registro') {
      // En desktop abre modal, en móvil abre wizard paso a paso
      if (window.innerWidth < 1024) {
        setMobileWizardAbierto(true);
      } else {
        setModalRegistroAbierto(true);
      }
    } else {
      setTabActiva(tab);
    }
  };

  const handleAbrirFinalizar = (tramite: Tramite) => {
    setTramiteAFinalizar(tramite);
  };

  const handleVerDetalle = (tramite: Tramite) => {
    if (window.innerWidth < 1024) {
      setMobileDetalleTramite(tramite);
    } else {
      setTramiteDetalle(tramite);
    }
  };

  const handleConfirmarFinalizacion = async (id: string, observaciones?: string) => {
    await finalizarTramite(id, observaciones);
    setTramiteAFinalizar(null);
    if (mobileDetalleTramite && mobileDetalleTramite.id === id) {
      setMobileDetalleTramite(null);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans">
      {/* =========================================
          VERSIÓN ESCRITORIO (Desktop >= 1024px)
          ========================================= */}
      <div className="hidden lg:flex w-full h-full">
        {/* Barra lateral fija institucional */}
        <Sidebar tabActiva={tabActiva} onCambiarTab={handleCambiarTab} />

        {/* Área principal con scroll vertical */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden">
          <Header />

          {mensajeError && (
            <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-800 font-semibold shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{mensajeError}</span>
              </div>
              <button
                type="button"
                onClick={limpiarError}
                className="p-1 hover:bg-amber-100 rounded-lg text-amber-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <main className="flex-1 p-6 space-y-6 max-w-[1920px] w-full mx-auto">
            {tabActiva === 'dashboard' && (
              <>
                <WelcomeSyncBanner />
                <MetricCards />
                <FilterBar onAbrirNuevo={() => setModalRegistroAbierto(true)} />
                <TramitesTable
                  tramites={tramitesFiltrados}
                  onVerDetalle={handleVerDetalle}
                  onFinalizar={handleAbrirFinalizar}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RecentActivityPanel onVerDetalle={handleVerDetalle} />
                  <DelegateStatsPanel />
                </div>
                <InstitutionalFooter />
              </>
            )}

            {tabActiva === 'tramites' && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">
                    Listado General de Saneamiento de Datos
                  </h2>
                </div>
                <FilterBar onAbrirNuevo={() => setModalRegistroAbierto(true)} />
                <TramitesTable
                  tramites={tramitesFiltrados}
                  onVerDetalle={handleVerDetalle}
                  onFinalizar={handleAbrirFinalizar}
                />
                <InstitutionalFooter />
              </>
            )}

            {tabActiva === 'reportes' && <ReportsView />}
            {tabActiva === 'usuarios' && <UsersView />}
            {tabActiva === 'configuracion' && <ConfigView />}
          </main>
        </div>
      </div>

      {/* =========================================
          VERSIÓN MOBILE-FIRST (Móvil / Tablet < 1024px)
          ========================================= */}
      <div className="flex lg:hidden flex-col w-full h-full bg-slate-100 overflow-hidden">
        {/* Cabecera institucional móvil con logos y operador */}
        <MobileHeader onAbrirMenu={() => setDrawerMenuAbierto(true)} />

        {mensajeError && (
          <div className="mx-3 mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-[11px] text-amber-800 font-semibold">
            <span>{mensajeError}</span>
            <button type="button" onClick={limpiarError} className="p-1">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Vista activa en móvil */}
        <div className="flex-1 overflow-y-auto">
          {tabActiva === 'dashboard' && (
            <MobileHomeView
              onAbrirRegistro={() => setMobileWizardAbierto(true)}
              onVerTodos={() => setTabActiva('tramites')}
              onVerDetalle={(t) => setMobileDetalleTramite(t)}
            />
          )}

          {tabActiva === 'tramites' && (
            <MobileTramitesListView
              onVerDetalle={(t) => setMobileDetalleTramite(t)}
            />
          )}

          {tabActiva === 'reportes' && (
            <div className="p-4 pb-24">
              <ReportsView />
            </div>
          )}

          {tabActiva === 'usuarios' && (
            <div className="p-4 pb-24">
              <UsersView />
            </div>
          )}

          {tabActiva === 'configuracion' && (
            <div className="p-4 pb-24">
              <ConfigView />
            </div>
          )}
        </div>

        {/* Barra de navegación inferior móvil */}
        <MobileBottomNav
          tabActiva={tabActiva}
          onCambiarTab={handleCambiarTab}
          onAbrirRegistro={() => setMobileWizardAbierto(true)}
          onAbrirMenu={() => setDrawerMenuAbierto(true)}
        />
      </div>

      {/* =========================================
          MODALES Y OVERLAYS GLOBALES
          ========================================= */}
      {/* Wizard móvil de registro paso a paso */}
      {mobileWizardAbierto && (
        <MobileRegisterWizard
          onCerrar={() => setMobileWizardAbierto(false)}
          onExito={() => {
            setMobileWizardAbierto(false);
            setTabActiva('tramites');
          }}
        />
      )}

      {/* Vista de detalle en móvil */}
      {mobileDetalleTramite && (
        <MobileDetailView
          tramite={mobileDetalleTramite}
          onVolver={() => setMobileDetalleTramite(null)}
          onFinalizar={(t) => setTramiteAFinalizar(t)}
        />
      )}

      {/* Drawer lateral de navegación móvil */}
      <MobileMenuDrawer
        isOpen={drawerMenuAbierto}
        onClose={() => setDrawerMenuAbierto(false)}
        tabActiva={tabActiva}
        onSeleccionarTab={handleCambiarTab}
      />

      {/* Modales para versión desktop */}
      <ModalRegistroTramite
        isOpen={modalRegistroAbierto}
        onClose={() => setModalRegistroAbierto(false)}
      />

      <ModalDetalleTramite
        tramite={tramiteDetalle}
        isOpen={!!tramiteDetalle}
        onClose={() => setTramiteDetalle(null)}
        onAbrirFinalizar={handleAbrirFinalizar}
      />

      {/* Modal oficial de confirmación de finalización (Desktop y Móvil) */}
      <ModalConfirmarFinalizacion
        tramite={tramiteAFinalizar}
        isOpen={!!tramiteAFinalizar}
        onClose={() => setTramiteAFinalizar(null)}
        onConfirmar={handleConfirmarFinalizacion}
      />
    </div>
  );
};

export default function App() {
  return (
    <TramitesProvider>
      <DashboardContent />
    </TramitesProvider>
  );
}
