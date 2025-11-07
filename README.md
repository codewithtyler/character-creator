# Character Creator

A Next.js application that generates reference images for LoRA (Low-Rank Adaptation) training. Upload a character image and automatically generate multiple variations from different angles, with different outfits, and in different backgrounds using Stable Diffusion.

## Features

- **Image Upload**: Upload a character image (drag & drop or click to upload)
- **Stable Diffusion Image-to-Image**: Uses Automatic1111 WebUI for image generation
- **Angle Variations**: Generates 5 different angle views:
  - Left 45°
  - Right 45°
  - Left 90° (profile)
  - Right 90° (profile)
  - Back 180° (back of head)
- **Outfit Variations**: Generates 3 different outfit styles:
  - Casual
  - Formal
  - Sporty
- **Background Variations**: Generates 3 different background settings:
  - Studio
  - Outdoor
  - Indoor
- **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Automatic1111 WebUI installed and running with API enabled

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up Automatic1111 WebUI:
   - Install from [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
   - Run with API enabled: `--api` flag
   - Default runs on `http://localhost:7860`

3. Create a `.env` file in the root directory (optional, if using a different URL):

```env
STABLE_DIFFUSION_API_URL=http://localhost:7860
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Upload Character Image**: Upload an image of a person facing forward. The app uses the image directly with Stable Diffusion's image-to-image generation, maintaining character consistency automatically.

2. **Automatic Generation**: The app will automatically generate:
   - 5 angle variations (2 images each = 10 images)
   - 3 outfit variations (2 images each = 6 images)
   - 3 background variations (2 images each = 6 images)
   - **Total: 22 reference images**

3. **Review & Download**: All generated images are displayed in organized sections. You can use these for LoRA training or other AI model fine-tuning purposes.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Automatic1111 WebUI** - Stable Diffusion API for image generation

## Project Structure

```text
├── app/
│   ├── api/
│   │   ├── analyze-image/      # API route for processing uploaded images
│   │   └── generate-variation/  # API route for generating image variations
│   ├── globals.css             # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page component
├── components/
│   ├── ImageUpload.tsx          # Image upload component
│   └── ReferenceImageGrid.tsx   # Grid display for all generated images
└── package.json
```

## Notes

- Image generation may take several minutes as it generates 22+ images
- Each variation generates 2 images for better diversity
- The generated images maintain character consistency through image-to-image generation
- The `denoising_strength` parameter (0.7) balances between preserving the original image and applying new variations
- Make sure Automatic1111 WebUI is running and accessible before generating images

## Troubleshooting

- **"Failed to generate images"**: Make sure Automatic1111 WebUI is running with the `--api` flag and accessible at the configured URL
- **Connection errors**: Check that `STABLE_DIFFUSION_API_URL` points to the correct address (default: `http://localhost:7860`)
- **Slow generation**: This is normal - generating 22+ images takes time. Consider using a faster GPU

## Use Cases

- **LoRA Training**: Generate consistent character reference images for training custom LoRA models
- **Character Design**: Create multiple views of a character for design documentation
- **Portfolio Building**: Generate professional reference sheets for character artists
- **AI Model Training**: Create datasets for fine-tuning image generation models
