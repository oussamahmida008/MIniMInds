# AI Lab

AI-powered vision and analysis laboratory built with Next.js and TensorFlow.js

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)

## Overview

AI Lab is a Next.js application featuring computer vision capabilities powered by TensorFlow.js and MediaPipe. The application includes real-time pose detection and image classification using your webcam.

## Features

- **Vision Lab**: Real-time computer vision analysis
- **Pose Detection**: Using MediaPipe Pose for body tracking
- **Image Classification**: Using MobileNet for object recognition
- **Webcam Integration**: Real-time video processing

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A webcam for vision features

### Installation

1. Navigate to the project directory:
```bash
cd ai-lab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technology Stack

- **Framework**: Next.js 16
- **UI**: React 19 with Tailwind CSS
- **AI/ML**: TensorFlow.js, MediaPipe
- **Components**: Radix UI
- **Styling**: Tailwind CSS with custom animations

## Project Structure

```
ai-lab/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions
├── public/          # Static assets
└── styles/          # Global styles
```

## License

Private project
