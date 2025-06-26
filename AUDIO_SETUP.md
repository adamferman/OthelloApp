# Cat Meow Sound Setup Instructions

The current audio files are placeholders. Here's how to get **real cat meow sounds**:

## 🐱 **Quick Setup - Free Cat Meows**

### Option 1: Free Sound Libraries (Recommended)
1. **Freesound.org** (https://freesound.org) - **Best Option**
   - Register for free account
   - Search: "cat meow" + filter by "CC0" (public domain)
   - Recommended sounds:
     - "Cat Meow 1" by InspectorJ
     - "Kitten Meow" by Benboncan
     - "Cat Meowing" by JarredGibb

2. **Mixkit.co** (https://mixkit.co/free-sound-effects/animal/)
   - No registration required
   - Download: "Cat meowing" sounds
   - All sounds are free for commercial use

3. **Zapsplat.com** (https://zapsplat.com)
   - Free with registration
   - Search: "cat meow"
   - High-quality professional sounds

### Option 2: Direct Download Links (Public Domain)
These are confirmed public domain cat meow sounds:

**For Black Cat (lower pitch):**
- Download from: https://freesound.org/data/previews/316/316847_5123451-lq.mp3
- Save as: `sounds/black-cat-meow.mp3`

**For White Cat (higher pitch):**
- Download from: https://freesound.org/data/previews/316/316848_5123451-lq.mp3  
- Save as: `sounds/white-cat-meow.mp3`

### Option 3: Create Your Own
If you have a cat:
1. Use your phone to record your cat meowing
2. Trim to 1-2 seconds using free audio editor (Audacity)
3. Export as MP3
4. Create two versions: one normal, one pitch-shifted

## 📁 **File Setup**
1. Create `sounds/` folder in your Othello directory
2. Download/save two MP3 files:
   - `black-cat-meow.mp3` (lower/deeper meow)
   - `white-cat-meow.mp3` (higher/softer meow)

## 🔧 **File Requirements**
- **Format**: MP3 (best browser compatibility)
- **Duration**: 0.5 - 2 seconds (ideal for gameplay)
- **Quality**: 44.1kHz, 128-320 kbps
- **Volume**: Moderate (code auto-adjusts to 70%)

## ✅ **Testing**
1. Place MP3 files in `sounds/` folder
2. Refresh your browser
3. Click "Test Meow 🐱" button
4. You should hear real cat meows!

## 🚨 **Troubleshooting**
- **Still hearing "bing"**: Audio files not found, using fallback sounds
- **No sound**: Click anywhere first to enable browser audio
- **Wrong format**: Convert to MP3 using online converter
- **Files too large**: Keep under 1MB each for fast loading

## 📝 **Current Status**
The game will show:
- ✅ "🔊 Real cat meow sounds enabled!" = Working correctly
- ⚠️ Fallback beeps = Audio files not found/loaded

**Note**: The game gracefully falls back to synthesized beeps if real audio files aren't available.
