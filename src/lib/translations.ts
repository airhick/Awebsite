/**
 * Translation system for Aurora Dashboard
 * Supports English, French, and German
 */

export type LanguageCode = 'en' | 'fr' | 'de'

export interface Translations {
  // Dashboard
  dashboard: {
    welcomeBack: string
    welcomeBackName: string
    overview: string
    loading: string
  }
  
  // Stats Cards
  stats: {
    totalCalls: string
    allTimeCalls: string
    activeLive: string
    currentlyInProgress: string
    transferred: string
    callsTransferred: string
    totalMinutes: string
    totalMinutesUsed: string
    minutesUsedTotal: string
    plan: string
    noCallData: string
    syncCallLogs: string
    syncing: string
    syncCalls: string
  }
  
  // Call Details
  calls: {
    previousCalls: string
    recentCalls: string
    see: string
    callSummary: string
    noSummary: string
    loadingSummary: string
    failedToLoad: string
    ended: string
    inProgress: string
  }
  
  // Assistant Config
  assistant: {
    configuration: string
    noConfiguration: string
    configureAgents: string
    systemPrompt: string
    tools: string
    showMore: string
    showLess: string
    technicalDetails: string
    assistantId: string
    model: string
    voice: string
    language: string
    firstMessage: string
  }
  
  // Webhook Notifications
  webhook: {
    incomingCall: string
    new: string
    callSummary: string
    receivedAt: string
    callId: string
    close: string
    pickUpCall: string
    noSummaryAvailable: string
    summaryExtractionError: string
    noCallIdAvailable: string
    callPickedUpSuccess: string
    callPickedUpPartial: string
    callPickupError: string
    webhookError: string
  }
  
  // Timeline Graph
  timeline: {
    title: string
    noData: string
    timeAxis: string
    callsAxis: string
    calls: string
    toolCalls: string
    handoffs: string
    totalCalls: string
  }
  
  // Call Manager
  callManager: {
    button: string
    title: string
    description: string
    phoneLabel: string
    phoneHint: string
    callButton: string
    calling: string
    callStarted: string
    callEnded: string
    callStopped: string
    connecting: string
    stopCall: string
    updatingContext: string
    updateError: string
    noApiKey: string
    callError: string
    startError: string
    stopError: string
  }
  
  // Help Center
  helpCenter: {
    pageTitle: string
    pageDescription: string
    title: string
    description: string
    yourInfo: string
    customerId: string
    email: string
    company: string
    notAvailable: string
    messageLabel: string
    messagePlaceholder: string
    messageHint: string
    messageRequired: string
    sendButton: string
    sending: string
    messageSent: string
    sendError: string
    customerNotFound: string
  }
  
  // Common
  common: {
    selectLanguage: string
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
  }
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    dashboard: {
      welcomeBack: 'Welcome back',
      welcomeBackName: 'Welcome back, {name}',
      overview: "Here's an overview of your AI receptionist",
      loading: 'Loading your dashboard...',
    },
    stats: {
      totalCalls: 'Total Calls',
      allTimeCalls: 'All time calls',
      activeLive: 'Active / Live',
      currentlyInProgress: 'Currently in progress',
      transferred: 'Transferred',
      callsTransferred: 'Calls transferred',
      totalMinutes: 'Total Minutes',
      totalMinutesUsed: 'Total minutes used',
      minutesUsedTotal: 'Minutes used / total minutes for {plan} plan',
      plan: 'plan',
      noCallData: 'No call data found',
      syncCallLogs: 'Sync call logs from VAPI to see statistics',
      syncing: 'Syncing...',
      syncCalls: 'Sync Calls',
    },
    calls: {
      previousCalls: 'Previous calls',
      recentCalls: 'Recent Calls',
      see: 'See',
      callSummary: 'Call Summary',
      noSummary: 'No summary available for this call.',
      loadingSummary: 'Loading summary...',
      failedToLoad: 'Failed to load summary',
      ended: 'ended',
      inProgress: 'in progress',
    },
    assistant: {
      configuration: 'Assistant Configuration',
      noConfiguration: 'No assistant configuration found',
      configureAgents: 'Make sure you have agents configured in your customer settings',
      systemPrompt: 'System Prompt',
      tools: 'Tools',
      showMore: 'Show more',
      showLess: 'Show less',
      technicalDetails: 'Technical Details',
      assistantId: 'Assistant ID',
      model: 'Model',
      voice: 'Voice',
      language: 'Language',
      firstMessage: 'First Message',
    },
    webhook: {
      incomingCall: 'Incoming Call',
      new: 'New',
      callSummary: 'Call Summary:',
      receivedAt: 'Received at',
      callId: 'Call ID:',
      close: 'Close',
      pickUpCall: 'Pick up the call',
      noSummaryAvailable: 'New incoming call - Summary not available',
      summaryExtractionError: 'New incoming call - Error extracting summary',
      noCallIdAvailable: 'No Call ID available for this notification',
      callPickedUpSuccess: 'Call picked up successfully',
      callPickedUpPartial: 'One webhook failed, but the call was picked up',
      callPickupError: 'Error picking up the call',
      webhookError: 'Error sending webhooks',
    },
    timeline: {
      title: 'Call Timeline',
      noData: 'No call data available for timeline',
      timeAxis: 'Time',
      callsAxis: 'Calls',
      calls: 'Calls',
      toolCalls: 'Tool Calls',
      handoffs: 'Handoffs',
      totalCalls: 'Total Calls',
    },
    callManager: {
      button: 'Call Manager',
      title: 'Call Your Personal Call Manager',
      description: 'Get instant answers about your previous calls. The call manager has access to all your call history and can answer questions about past conversations.',
      phoneLabel: 'Your Phone Number',
      phoneHint: 'Include country code (e.g., +1 for US)',
      callButton: 'Call Now',
      calling: 'Initiating...',
      callStarted: 'Call started!',
      callEnded: 'Call ended',
      callStopped: 'Call stopped',
      connecting: 'Connecting...',
      stopCall: 'Stop Call',
      updatingContext: 'Updating call manager with your call history...',
      updateError: 'Failed to update assistant context',
      noApiKey: 'VAPI API key not found',
      callError: 'Call error occurred',
      startError: 'Failed to start call',
      stopError: 'Failed to stop call',
    },
    helpCenter: {
      pageTitle: 'Help Center',
      pageDescription: 'Get in touch with the Aurora team for support and assistance.',
      title: 'Contact Aurora Team',
      description: 'Send us a message and we\'ll get back to you as soon as possible.',
      yourInfo: 'Your Information',
      customerId: 'Customer ID',
      email: 'Email',
      company: 'Company',
      notAvailable: 'N/A',
      messageLabel: 'Your Message',
      messagePlaceholder: 'Type your message here...',
      messageHint: 'Please provide as much detail as possible to help us assist you better.',
      messageRequired: 'Please enter a message',
      sendButton: 'Send Message',
      sending: 'Sending...',
      messageSent: 'Your message has been sent successfully!',
      sendError: 'Failed to send message. Please try again.',
      customerNotFound: 'Customer information not found. Please log in again.',
    },
    common: {
      selectLanguage: 'Select Language',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
    },
  },
  fr: {
    dashboard: {
      welcomeBack: 'Bon retour',
      welcomeBackName: 'Bon retour, {name}',
      overview: "Voici un aperçu de votre réceptionniste IA",
      loading: 'Chargement de votre tableau de bord...',
    },
    stats: {
      totalCalls: 'Total des appels',
      allTimeCalls: 'Tous les appels',
      activeLive: 'Actif / En direct',
      currentlyInProgress: 'En cours',
      transferred: 'Transférés',
      callsTransferred: 'Appels transférés',
      totalMinutes: 'Total des minutes',
      totalMinutesUsed: 'Total des minutes utilisées',
      minutesUsedTotal: 'Minutes utilisées / total des minutes pour le plan {plan}',
      plan: 'plan',
      noCallData: 'Aucune donnée d\'appel trouvée',
      syncCallLogs: 'Synchroniser les journaux d\'appels depuis VAPI pour voir les statistiques',
      syncing: 'Synchronisation...',
      syncCalls: 'Synchroniser les appels',
    },
    calls: {
      previousCalls: 'Appels précédents',
      recentCalls: 'Appels récents',
      see: 'Voir',
      callSummary: 'Résumé de l\'appel',
      noSummary: 'Aucun résumé disponible pour cet appels.',
      loadingSummary: 'Chargement du résumé...',
      failedToLoad: 'Échec du chargement du résumé',
      ended: 'terminé',
      inProgress: 'en cours',
    },
    assistant: {
      configuration: 'Configuration de l\'assistant',
      noConfiguration: 'Aucune configuration d\'assistant trouvée',
      configureAgents: 'Assurez-vous d\'avoir configuré des agents dans les paramètres de votre client',
      systemPrompt: 'Invite système',
      tools: 'Outils',
      showMore: 'Afficher plus',
      showLess: 'Afficher moins',
      technicalDetails: 'Détails techniques',
      assistantId: 'ID de l\'assistant',
      model: 'Modèle',
      voice: 'Voix',
      language: 'Langue',
      firstMessage: 'Premier message',
    },
    webhook: {
      incomingCall: 'Appel entrant',
      new: 'Nouveau',
      callSummary: 'Résumé de l\'appel:',
      receivedAt: 'Reçu à',
      callId: 'Call ID:',
      close: 'Fermer',
      pickUpCall: 'Pick up the call',
      noSummaryAvailable: 'Nouvel appel entrant - Résumé non disponible',
      summaryExtractionError: 'Nouvel appel entrant - Erreur lors de l\'extraction du résumé',
      noCallIdAvailable: 'Aucun Call ID disponible pour cette notification',
      callPickedUpSuccess: 'Appel récupéré avec succès',
      callPickedUpPartial: 'Un des webhooks a échoué, mais l\'appel a été récupéré',
      callPickupError: 'Erreur lors de la récupération de l\'appel',
      webhookError: 'Erreur lors de l\'envoi des webhooks',
    },
    timeline: {
      title: 'Chronologie des appels',
      noData: 'Aucune donnée d\'appel disponible pour la chronologie',
      timeAxis: 'Heure',
      callsAxis: 'Appels',
      calls: 'Appels',
      toolCalls: 'Appels d\'outils',
      handoffs: 'Transferts',
      totalCalls: 'Total des appels',
    },
    callManager: {
      button: 'Gestionnaire d\'appels',
      title: 'Appeler votre gestionnaire d\'appels personnel',
      description: 'Obtenez des réponses instantanées sur vos appels précédents. Le gestionnaire d\'appels a accès à tout votre historique d\'appels et peut répondre aux questions sur les conversations passées.',
      phoneLabel: 'Votre numéro de téléphone',
      phoneHint: 'Inclure l\'indicatif pays (ex: +33 pour la France)',
      callButton: 'Appeler maintenant',
      calling: 'Initiation...',
      callStarted: 'Appel démarré !',
      callEnded: 'Appel terminé',
      callStopped: 'Appel arrêté',
      connecting: 'Connexion...',
      stopCall: 'Arrêter l\'appel',
      updatingContext: 'Mise à jour du gestionnaire d\'appels avec votre historique...',
      updateError: 'Échec de la mise à jour du contexte de l\'assistant',
      noApiKey: 'Clé API VAPI introuvable',
      callError: 'Erreur d\'appel survenue',
      startError: 'Échec du démarrage de l\'appel',
      stopError: 'Échec de l\'arrêt de l\'appel',
    },
    helpCenter: {
      pageTitle: 'Centre d\'aide',
      pageDescription: 'Contactez l\'équipe Aurora pour obtenir de l\'aide et du support.',
      title: 'Contacter l\'équipe Aurora',
      description: 'Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.',
      yourInfo: 'Vos informations',
      customerId: 'ID client',
      email: 'Email',
      company: 'Entreprise',
      notAvailable: 'N/A',
      messageLabel: 'Votre message',
      messagePlaceholder: 'Tapez votre message ici...',
      messageHint: 'Veuillez fournir autant de détails que possible pour nous aider à mieux vous assister.',
      messageRequired: 'Veuillez entrer un message',
      sendButton: 'Envoyer le message',
      sending: 'Envoi...',
      messageSent: 'Votre message a été envoyé avec succès !',
      sendError: 'Échec de l\'envoi du message. Veuillez réessayer.',
      customerNotFound: 'Informations client introuvables. Veuillez vous reconnecter.',
    },
    common: {
      selectLanguage: 'Sélectionner la langue',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
    },
  },
  de: {
    dashboard: {
      welcomeBack: 'Willkommen zurück',
      welcomeBackName: 'Willkommen zurück, {name}',
      overview: 'Hier ist eine Übersicht über Ihren KI-Empfang',
      loading: 'Ihr Dashboard wird geladen...',
    },
    stats: {
      totalCalls: 'Gesamt Anrufe',
      allTimeCalls: 'Alle Anrufe',
      activeLive: 'Aktiv / Live',
      currentlyInProgress: 'Aktuell in Bearbeitung',
      transferred: 'Weitergeleitet',
      callsTransferred: 'Weitergeleitete Anrufe',
      totalMinutes: 'Gesamt Minuten',
      totalMinutesUsed: 'Gesamt verwendete Minuten',
      minutesUsedTotal: 'Verwendete Minuten / Gesamt Minuten für {plan} Plan',
      plan: 'Plan',
      noCallData: 'Keine Anrufdaten gefunden',
      syncCallLogs: 'Anrufprotokolle von VAPI synchronisieren, um Statistiken anzuzeigen',
      syncing: 'Synchronisierung...',
      syncCalls: 'Anrufe synchronisieren',
    },
    calls: {
      previousCalls: 'Vorherige Anrufe',
      recentCalls: 'Letzte Anrufe',
      see: 'Ansehen',
      callSummary: 'Anrufzusammenfassung',
      noSummary: 'Keine Zusammenfassung für diesen Anruf verfügbar.',
      loadingSummary: 'Zusammenfassung wird geladen...',
      failedToLoad: 'Zusammenfassung konnte nicht geladen werden',
      ended: 'beendet',
      inProgress: 'in Bearbeitung',
    },
    assistant: {
      configuration: 'Assistenten-Konfiguration',
      noConfiguration: 'Keine Assistenten-Konfiguration gefunden',
      configureAgents: 'Stellen Sie sicher, dass Sie Agenten in Ihren Kundeneinstellungen konfiguriert haben',
      systemPrompt: 'Systemaufforderung',
      tools: 'Werkzeuge',
      showMore: 'Mehr anzeigen',
      showLess: 'Weniger anzeigen',
      technicalDetails: 'Technische Details',
      assistantId: 'Assistenten-ID',
      model: 'Modell',
      voice: 'Stimme',
      language: 'Sprache',
      firstMessage: 'Erste Nachricht',
    },
    webhook: {
      incomingCall: 'Eingehender Anruf',
      new: 'Neu',
      callSummary: 'Anrufzusammenfassung:',
      receivedAt: 'Empfangen um',
      callId: 'Anruf-ID:',
      close: 'Schließen',
      pickUpCall: 'Anruf annehmen',
      noSummaryAvailable: 'Neuer eingehender Anruf - Zusammenfassung nicht verfügbar',
      summaryExtractionError: 'Neuer eingehender Anruf - Fehler beim Extrahieren der Zusammenfassung',
      noCallIdAvailable: 'Keine Anruf-ID für diese Benachrichtigung verfügbar',
      callPickedUpSuccess: 'Anruf erfolgreich angenommen',
      callPickedUpPartial: 'Ein Webhook ist fehlgeschlagen, aber der Anruf wurde angenommen',
      callPickupError: 'Fehler beim Annehmen des Anrufs',
      webhookError: 'Fehler beim Senden der Webhooks',
    },
    timeline: {
      title: 'Anruf-Zeitachse',
      noData: 'Keine Anrufdaten für die Zeitachse verfügbar',
      timeAxis: 'Zeit',
      callsAxis: 'Anrufe',
      calls: 'Anrufe',
      toolCalls: 'Tool-Aufrufe',
      handoffs: 'Weiterleitungen',
      totalCalls: 'Gesamtanzahl Anrufe',
    },
    callManager: {
      button: 'Anruf-Manager',
      title: 'Rufen Sie Ihren persönlichen Anruf-Manager an',
      description: 'Erhalten Sie sofortige Antworten zu Ihren vorherigen Anrufen. Der Anruf-Manager hat Zugriff auf Ihre gesamte Anrufhistorie und kann Fragen zu vergangenen Gesprächen beantworten.',
      phoneLabel: 'Ihre Telefonnummer',
      phoneHint: 'Ländercode einschließen (z.B. +49 für Deutschland)',
      callButton: 'Jetzt anrufen',
      calling: 'Wird initiiert...',
      callStarted: 'Anruf gestartet!',
      callEnded: 'Anruf beendet',
      callStopped: 'Anruf gestoppt',
      connecting: 'Verbinden...',
      stopCall: 'Anruf beenden',
      updatingContext: 'Anruf-Manager wird mit Ihrem Anrufverlauf aktualisiert...',
      updateError: 'Fehler beim Aktualisieren des Assistenten-Kontexts',
      noApiKey: 'VAPI API-Schlüssel nicht gefunden',
      callError: 'Anruf-Fehler aufgetreten',
      startError: 'Fehler beim Starten des Anrufs',
      stopError: 'Fehler beim Beenden des Anrufs',
    },
    helpCenter: {
      pageTitle: 'Hilfezentrum',
      pageDescription: 'Kontaktieren Sie das Aurora-Team für Support und Hilfe.',
      title: 'Aurora-Team kontaktieren',
      description: 'Senden Sie uns eine Nachricht und wir werden uns so schnell wie möglich bei Ihnen melden.',
      yourInfo: 'Ihre Informationen',
      customerId: 'Kunden-ID',
      email: 'E-Mail',
      company: 'Unternehmen',
      notAvailable: 'N/V',
      messageLabel: 'Ihre Nachricht',
      messagePlaceholder: 'Geben Sie hier Ihre Nachricht ein...',
      messageHint: 'Bitte geben Sie so viele Details wie möglich an, damit wir Ihnen besser helfen können.',
      messageRequired: 'Bitte geben Sie eine Nachricht ein',
      sendButton: 'Nachricht senden',
      sending: 'Wird gesendet...',
      messageSent: 'Ihre Nachricht wurde erfolgreich gesendet!',
      sendError: 'Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
      customerNotFound: 'Kundeninformationen nicht gefunden. Bitte melden Sie sich erneut an.',
    },
    common: {
      selectLanguage: 'Sprache auswählen',
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
    },
  },
}

import { useLanguageStore } from '@/stores/language-store'

/**
 * Get current language code
 */
function getCurrentLanguageCode(): LanguageCode {
  if (typeof window === 'undefined') return 'en'
  
  try {
    const stored = localStorage.getItem('aurora-language-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      const code = parsed.code as LanguageCode
      if (code === 'en' || code === 'fr' || code === 'de') {
        return code
      }
    }
  } catch {
    // Ignore errors
  }
  
  return 'en'
}

/**
 * Get translation for current language (React hook)
 */
export function useTranslation() {
  const { currentLanguage } = useLanguageStore()
  const lang = (currentLanguage.code as LanguageCode) || 'en'
  
  // Ensure only valid languages
  const validLang: LanguageCode = (lang === 'en' || lang === 'fr' || lang === 'de') ? lang : 'en'
  
  return translations[validLang] || translations.en
}

/**
 * Format translation string with variables (utility function)
 */
export function t(key: string, vars?: Record<string, string>): string {
  const lang = getCurrentLanguageCode()
  const translation = translations[lang] || translations.en
  
  // Navigate nested object (e.g., "dashboard.welcomeBack")
  const keys = key.split('.')
  let value: any = translation
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) break
  }
  
  if (typeof value !== 'string') {
    // Fallback to English
    const enKeys = key.split('.')
    let enValue: any = translations.en
    for (const k of enKeys) {
      enValue = enValue?.[k]
      if (enValue === undefined) break
    }
    value = enValue || key
  }
  
  // Replace variables
  if (vars) {
    return value.replace(/\{(\w+)\}/g, (match: string, varName: string) => {
      return vars[varName] || match
    })
  }
  
  return value
}

