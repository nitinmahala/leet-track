// Centralized Firebase initialization with fallback for preview environments

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getAuth } from "firebase/auth"

// Add this function at the top of the file, before the firebaseConfig
// This will help detect if IndexedDB is available for Firestore persistence
function isIndexedDBAvailable() {
  try {
    // Check if IndexedDB is available
    if (typeof window !== "undefined" && typeof window.indexedDB !== "undefined" && window.indexedDB !== null) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM70I15Pi_dtUuDhFfb0PhauAbJHHL9PM",
  authDomain: "leetrack-55833.firebaseapp.com",
  projectId: "leetrack-55833",
  storageBucket: "leetrack-55833.firebasestorage.app",
  messagingSenderId: "325613206477",
  appId: "1:325613206477:web:8b81fa81a2c19e8eed6284",
  measurementId: "G-V9HHHW32D2",
}

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Check if we're in preview mode (v0 preview or Vercel preview)
const isPreview =
  isBrowser && (window.location.hostname.includes("v0.dev") || window.location.hostname.includes("vercel-preview"))

// Enhance the mock Firestore implementation to better handle offline scenarios
const createMockFirestore = () => {
  // Create a simple in-memory storage for mock data
  const mockData: Record<string, Record<string, any>> = {
    userSettings: {},
  }

  return {
    collection: (collectionName: string) => ({
      doc: (docId: string) => ({
        get: async () => ({
          exists: () => {
            return mockData[collectionName] && mockData[collectionName][docId] !== undefined
          },
          data: () => {
            return mockData[collectionName]?.[docId] || {}
          },
        }),
        set: async (data: any) => {
          if (!mockData[collectionName]) {
            mockData[collectionName] = {}
          }
          mockData[collectionName][docId] = data
        },
        update: async (data: any) => {
          if (!mockData[collectionName]) {
            mockData[collectionName] = {}
          }
          if (!mockData[collectionName][docId]) {
            mockData[collectionName][docId] = {}
          }
          mockData[collectionName][docId] = {
            ...mockData[collectionName][docId],
            ...data,
          }
        },
      }),
      where: () => ({
        orderBy: () => ({
          get: async () => ({
            docs: [],
          }),
          onSnapshot: (callback: any) => {
            callback({ docs: [] })
            return () => {}
          },
        }),
        get: async () => ({
          docs: [],
        }),
        onSnapshot: (callback: any) => {
          callback({ docs: [] })
          return () => {}
        },
      }),
      orderBy: () => ({
        get: async () => ({
          docs: [],
        }),
        onSnapshot: (callback: any) => {
          callback({ docs: [] })
          return () => {}
        },
      }),
      onSnapshot: (callback: any) => {
        callback({ docs: [] })
        return () => {}
      },
    }),
    doc: (path: string) => {
      const [collectionName, docId] = path.split("/")
      return {
        get: async () => ({
          exists: () => {
            return mockData[collectionName] && mockData[collectionName][docId] !== undefined
          },
          data: () => {
            return mockData[collectionName]?.[docId] || {}
          },
        }),
        set: async (data: any) => {
          if (!mockData[collectionName]) {
            mockData[collectionName] = {}
          }
          mockData[collectionName][docId] = data
        },
        update: async (data: any) => {
          if (!mockData[collectionName]) {
            mockData[collectionName] = {}
          }
          if (!mockData[collectionName][docId]) {
            mockData[collectionName][docId] = {}
          }
          mockData[collectionName][docId] = {
            ...mockData[collectionName][docId],
            ...data,
          }
        },
      }
    },
  }
}

// Create a mock implementation for Auth
const createMockAuth = () => {
  return {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      callback(null)
      return () => {}
    },
    signInWithEmailAndPassword: async () => {},
    createUserWithEmailAndPassword: async () => {},
    signOut: async () => {},
  }
}

// Initialize Firebase with error handling
let firebaseApp: any
let db: any
let auth: any

try {
  // Only initialize Firebase if we're in a browser and not in preview mode
  if (isBrowser && !isPreview) {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()
    db = getFirestore(firebaseApp)
    auth = getAuth(firebaseApp)

    // Enable offline persistence if in browser
    if (isBrowser) {
      // Only enable persistence if IndexedDB is available
      if (isIndexedDBAvailable()) {
        enableIndexedDbPersistence(db)
          .then(() => {
            console.log("Firestore persistence enabled successfully")
          })
          .catch((err) => {
            if (err.code === "failed-precondition") {
              // Multiple tabs open, persistence can only be enabled in one tab at a time
              console.log("Persistence failed: Multiple tabs open")
            } else if (err.code === "unimplemented") {
              // The current browser does not support persistence
              console.log("Persistence not supported in this browser")
            } else {
              console.error("Unknown persistence error:", err)
            }
          })
      } else {
        console.log("IndexedDB not available, Firestore persistence disabled")
      }
    }
  } else {
    // Create mock implementations for preview environments
    console.log("Using mock Firebase implementation for preview environment")
    db = createMockFirestore()
    auth = createMockAuth()
  }
} catch (error) {
  console.error("Error initializing Firebase:", error)

  // Provide mock implementations if initialization fails
  db = createMockFirestore()
  auth = createMockAuth()
}

export { firebaseApp, db, auth }
