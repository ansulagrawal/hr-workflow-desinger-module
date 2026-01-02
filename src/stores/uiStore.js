/**
 * UI Store - Manages UI state like panels, modals, and simulation state
 */

import { create } from "zustand";

const useUIStore = create((set, get) => ({
  // Panel visibility
  isNodePaletteOpen: true,
  isFormPanelOpen: true,
  isSandboxOpen: false,

  // Simulation state
  isSimulating: false,
  simulationResults: null,
  simulationSteps: [],

  // Validation state
  validationErrors: [],
  validationWarnings: [],

  // Modal state
  activeModal: null,
  modalData: null,

  // Notifications
  notifications: [],

  // Panel toggles
  toggleNodePalette: () => {
    set(state => ({ isNodePaletteOpen: !state.isNodePaletteOpen }));
  },

  toggleFormPanel: () => {
    set(state => ({ isFormPanelOpen: !state.isFormPanelOpen }));
  },

  toggleSandbox: () => {
    set(state => ({ isSandboxOpen: !state.isSandboxOpen }));
  },

  openSandbox: () => {
    set({ isSandboxOpen: true });
  },

  closeSandbox: () => {
    set({ isSandboxOpen: false });
  },

  // Simulation
  startSimulation: () => {
    set({
      isSimulating: true,
      simulationResults: null,
      simulationSteps: [],
    });
  },

  updateSimulationStep: step => {
    set(state => {
      const existingIndex = state.simulationSteps.findIndex(s => s.nodeId === step.nodeId);

      let newSteps;
      if (existingIndex >= 0) {
        newSteps = [...state.simulationSteps];
        newSteps[existingIndex] = step;
      } else {
        newSteps = [...state.simulationSteps, step];
      }

      return { simulationSteps: newSteps };
    });
  },

  completeSimulation: results => {
    set({
      isSimulating: false,
      simulationResults: results,
    });
  },

  clearSimulation: () => {
    set({
      isSimulating: false,
      simulationResults: null,
      simulationSteps: [],
    });
  },

  // Validation
  setValidationResults: (errors, warnings = []) => {
    set({
      validationErrors: errors,
      validationWarnings: warnings,
    });
  },
  clearValidationResults: () => {
    set({
      validationErrors: [],
      validationWarnings: [],
    });
  },

  // Modal
  openModal: (modalType, data = null) => {
    set({
      activeModal: modalType,
      modalData: data,
    });
  },

  closeModal: () => {
    set({
      activeModal: null,
      modalData: null,
    });
  },

  // Notifications
  addNotification: notification => {
    const id = Date.now().toString();
    set(state => ({
      notifications: [...state.notifications, { id, ...notification, createdAt: new Date() }],
    }));

    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration || 5000);
    }

    return id;
  },

  removeNotification: id => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Canvas state
  canvasViewport: { x: 0, y: 0, zoom: 1 },

  setCanvasViewport: viewport => {
    set({ canvasViewport: viewport });
  },
}));

export default useUIStore;
