# Site Architecture - Structure

## Directory Layout
- `/`: Main entry point and configuration.
- `/assets/`: Static assets.
    - `/images/`: Granularly organized by type.
        - `branding/`: Logos and main visual identity.
        - `backgrounds/`: Textures and background images.
        - `partners/`: Partner and certification logos.
        - `clients/`: Client photos and testimonials.
        - `sections/`: Images specific to page sections.
        - `ui/`: Interface elements.
    - `/icons/`: Favicons and UI icons.
- `/src/`: Source code.
    - `/styles/`: CSS files.
    - `/scripts/`: Logic and interactivity.
    - `/config/`: Centralized configurations (Integrations, Constants).
- `/pages/`: Satellite marketing pages.
- `/docs/`: Project documentation.

## Naming Conventions
- **Assets**: `[category]-[description].[extension]`
  - Example: `branding/logo-primary.webp`, `sections/section-hero-main.webp`
- **Folders**: Lowercase kebab-case.
- **Files**: Lowercase kebab-case.
