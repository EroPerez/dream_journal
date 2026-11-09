# 🌌 ONEIRIC — Multimodal Surrealist Dream Journal & Archetypal Analyst
### *Diario Onírico Surrealista Multimodal y Analista Arquetípico*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash_%7C_3--Pro--Image_%7C_3.5--Transcribe-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

---

## 🌐 Language Navigation / Navegación de Idioma
- [English Documentation](#-english-documentation)
  - [Overview](#overview)
  - [Core Features](#core-features)
  - [AI Model Architecture](#ai-model-architecture)
  - [Getting Started](#getting-started)
  - [Project Structure](#project-structure)
- [Documentación en Español](#-documentación-en-español)
  - [Descripción General](#descripción-general)
  - [Características Principales](#características-principales)
  - [Arquitectura de Modelos de IA](#arquitectura-de-modelos-de-ia)
  - [Instalación y Uso](#instalación-y-uso)
  - [Estructura del Proyecto](#estructura-del-proyecto)

---

# 🇬🇧 English Documentation

## Overview
**Oneiric** is a multimodal subconscious dream journal and psychological analysis platform designed around analytical psychology principles from **Carl Gustav Jung**. 

Upon waking, memories of dreams evaporate rapidly. Oneiric allows dreamers to voice-record their memories immediately before conscious ego rationalization sets in. The system transcribes the stream of consciousness, paints a museum-grade surrealist visual artwork representing the core emotional theme in **1K, 2K, or 4K resolution**, extracts recognized Jungian archetypes and subconscious symbols, offers an interactive chat with an archetypal psychoanalyst, plots dream frequency on a monthly heatmap calendar, and allows sharing dream cards to social media.

---

## Core Features

### 🎙️ 1. Immediate Waking Voice Recording & Transcription
- **Real-Time Audio Recorder**: Pulsating microphone interface with live Web Audio API frequency visualizer, timer, pause/resume, and audio preview.
- **Speech-to-Text Transcription**: Powered by **`gemini-3.5-transcribe`**, accurately preserving raw stream-of-consciousness, fragmented memories, and emotional nuances.
- **Text Scribing Mode**: Alternative tab for manual writing with creative dream prompt starters.

### 🎨 2. Subconscious Surrealist Visual Art
- **Surrealist Engine**: Powered by **`gemini-3-pro-image-preview`**, synthesizing artistic influences from René Magritte, Salvador Dalí, Remedios Varo, and Giorgio de Chirico.
- **Resolution Affordance**: Choose and re-render artwork at **1K (1024px)**, **2K (2048px)**, or **4K (4096px)**.
- **Aspect Ratios**: Supports `1:1` (Square), `16:9` (Cinematic Widescreen), and `4:3` (Classic Canvas).
- **Surrealist Prompt Inspector & Lightbox**: Fullscreen inspection and original resolution download.

### 🏛️ 3. Structured Psychological & Jungian Interpretation
- **Emotional Core & Tension**: Uncovers the underlying emotional conflict or subconscious yearning.
- **Atmospheric Profile**: Surreal sensory keywords describing the dream realm.
- **Recognized Archetypes**: Individual cards for manifestations of *The Shadow*, *The Anima/Animus*, *The Threshold Guardian*, *The Self*, *The Persona*, *The Trickster*, and *The Wise Old Man*.
- **Subconscious Symbols Explorer**: Mythic and universal amplification of dream objects with introspective self-reflection prompts.
- **The Jungian Synthesis**: Comprehensive analytical synthesis bridging the collective unconscious and waking ego.
- **Waking Integration Ritual**: Practical active imagination exercise or journaling prompt.

### 💬 4. Multi-Turn Chat with Dr. Carl Jung
- **Persona Archetypal Analyst**: Role-grounded conversational agent powered by **`gemini-3.8-flash`**.
- **Contextual Grounding**: Fully aware of the current dream transcript, archetypes, and subconscious symbols.
- **Quick Symbol Chips & Suggestions**: Tap any symbol in the dream to ask for immediate psychological amplification.

### 📅 5. Monthly Calendar & REM Heatmap
- **Daily Frequency Visualization**: Daily dream counter badges with color-coded nocturnal heat glow (distinguishing normal vs intense multi-dream REM nights).
- **Key Archetype Markers**: Color-coded manifestation pills on each calendar day.
- **Archetype Filter**: Filter the entire calendar to reveal patterns of recurring archetypes across the month.
- **Nocturnal Day Inspector**: Flyout drawer listing dreams for the selected date with a direct link to open them in the studio canvas.

### 🏷️ 6. Tagging & Categorization System
- **Hashtag Categorization**: Tag dreams by state or theme (e.g. `#lucid`, `#nightmare`, `#recurring`, `#flying`, `#shadow-work`, `#water`).
- **AI Suggested Tags**: Automatically suggested during dream analysis.
- **Sidebar Filtering**: Search and filter dream history by hashtag categories or archetypes.

### 📱 7. Social Media Sharing Suite
- **Custom Platform Formats**: Tailored templates for **X (Twitter)**, **Instagram**, **WhatsApp/Telegram**, and **LinkedIn**.
- **Story Card Generator (9:16 Canvas PNG)**: Generates and downloads a composite vertical image with the surrealist painting, dream title, quote, and archetype badges.
- **AI Caption Rewriter**: Instant tone switching (Poetic, Jungian, Mysterious, Minimal).
- **Native Share Integration**: Uses Web Share API (`navigator.share`) on mobile and desktop.

---

## AI Model Architecture

| Capability | Model | Server Endpoint |
|---|---|---|
| Audio Voice Transcription | `gemini-3.5-transcribe` | `POST /api/transcribe` |
| Psychological Archetype Analysis | `gemini-3.8-flash` | `POST /api/analyze-dream` |
| Surrealist Artwork (1K, 2K, 4K) | `gemini-3-pro-image-preview` | `POST /api/generate-image` |
| Multi-Turn Jungian Analyst Chat | `gemini-3.8-flash` | `POST /api/chat` |
| Social Media Caption Generator | `gemini-3.8-flash` | `POST /api/generate-social-post` |

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- Google Gemini API Key (`GEMINI_API_KEY`)

### Setup & Installation
```bash
# Clone or navigate to the repository
cd applet

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and add your key:
# GEMINI_API_KEY="your-gemini-api-key"

# Run development server (full-stack Express + Vite)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
npm start
```

---

## Project Structure
```text
├── server.ts                       # Express backend proxy for Gemini APIs
├── index.html                      # HTML entry point with Cinzel typography
├── package.json                    # Full-stack dependencies & scripts
├── src/
│   ├── main.tsx                    # React client mount
│   ├── App.tsx                     # Main state & view coordinator
│   ├── index.css                   # Tailwind v4 & atmospheric styles
│   ├── types.ts                    # TypeScript models (DreamEntry, Archetypes, Symbols)
│   ├── sampleDreams.ts             # Rich November 2026 pre-populated dataset
│   └── components/
│       ├── VoiceRecorderModal.tsx  # Audio recording & resolution selectors
│       ├── SurrealistArtViewer.tsx # 1K/2K/4K surrealist artwork viewer & downloader
│       ├── PsychologicalInterpretation.tsx # Jungian archetypes, symbols & tags
│       ├── JungianChatInterface.tsx # Multi-turn Dr. Carl Jung chat
│       ├── DreamCalendarView.tsx   # Monthly calendar grid & REM heatmap
│       ├── JournalSidebar.tsx      # Archive drawer, search & tag filters
│       ├── DreamSocialShareModal.tsx # Social post generator & Story card exporter
│       └── ImageLightbox.tsx       # High-resolution artwork zoom modal
```

---
---

# 🇪🇸 Documentación en Español

## Descripción General
**Oneiric** es un diario de sueños subconsciente multimodal y una plataforma de análisis psicológico basada en los principios de la psicología analítica de **Carl Gustav Jung**.

Al despertar, los recuerdos de los sueños se disuelven con rapidez. Oneiric permite a los soñadores grabar su relato de voz inmediatamente al abrir los ojos, antes de que el ego consciente y la rutina borren los detalles. La aplicación transcribe el flujo de consciencia, genera una pintura surrealista de calidad artística en resolución **1K, 2K o 4K** que representa el núcleo emocional, extrae arquetipos y símbolos junguianos, ofrece un chat interactivo con el "Dr. Carl Jung", visualiza la actividad onírica en un calendario mensual con mapa de calor y permite compartir tarjetas en redes sociales.

---

## Características Principales

### 🎙️ 1. Grabación de Voz al Despertar y Transcripción
- **Grabadora de Audio en Tiempo Real**: Botón de micrófono pulsante con medidor visual de frecuencias (Web Audio API), cronómetro, pausa/reanudación y reproducción previa.
- **Transcripción Fiel**: Con la tecnología de **`gemini-3.5-transcribe`**, respeta el flujo de consciencia, las dudas y los matices emocionales sin censura ni resúmenes.
- **Modo Escritura**: Pestaña alternativa para redactar o editar el sueño con detonadores creativos de memoria.

### 🎨 2. Arte Surrealista del Subconsciente
- **Motor Surrealista**: Desarrollado con **`gemini-3-pro-image-preview`**, sintetizando la estética de Salvador Dalí, René Magritte, Remedios Varo y Giorgio de Chirico.
- **Resolución Configurable**: Permite generar y re-renderizar obras en **1K (1024px)**, **2K (2048px)** o **4K (4096px)**.
- **Relaciones de Aspecto**: Compatible con `1:1` (Cuadrado), `16:9` (Cinemático) y `4:3` (Clásico).
- **Visor Lightbox y Descarga**: Inspección del prompt surrealista, visualización a pantalla completa y descarga en alta calidad.

### 🏛️ 3. Interpretación Psicológica Estructurada (Carl Jung)
- **Núcleo y Tensión Emocional**: Identifica el conflicto psíquico o anhelo subyacente.
- **Perfil Atmosférico**: Palabras clave sensoriales y estéticas del reino onírico.
- **Arquetipos Reconocidos**: Tarjetas detalladas para *La Sombra*, *El Ánima/Ánimus*, *El Guardián del Umbral*, *El Sí-Mismo*, *La Persona*, *El Embaucador* y *El Anciano Sabio*.
- **Explorador de Símbolos**: Amplificación mítica y universal de los objetos del sueño junto con preguntas de autoindagación para la vida diaria.
- **Síntesis Junguiana**: Ensayo analítico profundo que conecta el inconsciente colectivo con el ego consciente.
- **Práctica de Integración**: Ejercicio de imaginación activa o ritual de diario para asentar el aprendizaje en la vigilia.

### 💬 4. Chat Interactivo con el "Dr. Carl Jung"
- **Analista Conversacional Multiviaje**: Impulsado por **`gemini-3.8-flash`**, adopta con rigor y empatía el rol de Carl Jung.
- **Contexto Onírico**: Fundamentado en la transcripción, símbolos y arquetipos del sueño actual.
- **Fichas Rápidas de Símbolos**: Haz clic en cualquier símbolo del sueño para preguntar de forma instantánea por su significado.

### 📅 5. Calendario Mensual y Mapa de Calor Onírico
- **Frecuencia Diaria**: Contadores diarios con iluminación nocturna según la intensidad de la actividad REM (1 sueño vs. 2 o más sueños).
- **Marcadores de Arquetipos**: Etiquetas de colores en cada casilla del calendario.
- **Filtro por Arquetipo**: Resalta todos los días del mes en los que se manifestó un arquetipo específico (ej. *La Sombra*).
- **Inspector Nocturno por Fecha**: Panel lateral con los sueños del día seleccionado y acceso directo al estudio.

### 🏷️ 6. Sistema de Etiquetas y Categorías (#tags)
- **Categorización por Hashtag**: Agrupa sueños por emoción o tipo (ej. `#lucid`, `#nightmare`, `#recurring`, `#shadow-work`, `#water`).
- **Etiquetas Sugeridas por IA**: Sugerencias automáticas extraídas durante el análisis.
- **Filtros en Barra Lateral**: Filtra y busca en tu archivo por etiquetas o arquetipos.

### 📱 7. Publicación en Redes Sociales
- **Formatos Personalizados**: Textos optimizados para **X (Twitter)**, **Instagram**, **WhatsApp/Telegram** y **LinkedIn**.
- **Generador de Tarjetas para Stories (9:16 PNG)**: Crea y descarga una imagen vertical con la obra surrealista, el título del sueño, la cita emocional y los arquetipos.
- **Redacción Asistida con IA**: Genera textos en tono poético, junguiano, misterioso o breve.
- **Integración con Web Share API**: Menú nativo para compartir en dispositivos móviles y de escritorio.

---

## Arquitectura de Modelos de IA

| Funcionalidad | Modelo | Endpoint del Servidor |
|---|---|---|
| Transcripción de Voz | `gemini-3.5-transcribe` | `POST /api/transcribe` |
| Análisis Psicológico y Arquetipos | `gemini-3.8-flash` | `POST /api/analyze-dream` |
| Pintura Surrealista (1K, 2K, 4K) | `gemini-3-pro-image-preview` | `POST /api/generate-image` |
| Chat con el Dr. Carl Jung | `gemini-3.8-flash` | `POST /api/chat` |
| Redacción de Posts para Redes | `gemini-3.8-flash` | `POST /api/generate-social-post` |

---

## Instalación y Uso

### Requisitos Previos
- Node.js 18+ o 20+
- Clave de API de Google Gemini (`GEMINI_API_KEY`)

### Pasos de Instalación
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Copia .env.example a .env e introduce tu clave:
# GEMINI_API_KEY="tu-clave-gemini"

# Iniciar servidor de desarrollo (Express + Vite)
npm run dev
```
Accede a [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilación para Producción
```bash
npm run build
npm start
```

---

## Licencia
Código publicado bajo la licencia Apache 2.0. Desarrollado con Google AI Studio y el SDK oficial `@google/genai`.
