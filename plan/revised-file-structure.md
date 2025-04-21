# Enhanced Gemstone System - Revised File Structure

This document provides a comprehensive file structure for the enhanced gemstone system that covers the complete lifecycle from rough stones to jewelry, with specialized user roles and marketplace functionality.

## Project Structure Overview

```
gemstone-system/
├── README.md
├── packages/
│   ├── frontend/               # User-facing SPA (React/Vite)
│   └── backend/                # Backend API and Admin Panel (Node.js/Express)
└── database/                   # Database migrations and schemas (PostgreSQL)
```

## Frontend Structure (React App with Vite)

```
packages/frontend/
├── .env.development            # Environment variables for development
├── .env.production             # Environment variables for production
├── .gitignore
├── index.html
├── package.json                # Dependencies (React, Tailwind, Vite)
├── postcss.config.js           # PostCSS configuration for Tailwind
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundler configuration
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── assets/
│       ├── images/             # Static images
│       │   ├── gemstones/      # Gemstone reference images
│       │   ├── jewelry/        # Jewelry reference images
│       │   ├── cuts/           # Cut reference images
│       │   └── logos/          # Logo images
│       ├── icons/              # System icons
│       └── data/               # Static data files
│           └── initial-data/
│               ├── colors.json
│               ├── cut-shapes.json
│               ├── gemstone-families.json
│               └── materials.json
└── src/
    ├── App.tsx                 # Main app component with routing
    ├── App.css                 # Root styles
    ├── main.tsx                # Entry point
    ├── vite-env.d.ts
    ├── index.css               # Root CSS file with Tailwind imports
    ├── assets/
    │   ├── styles/
    │   │   ├── index.css
    │   │   └── tailwind.css
    │   ├── images/             # Image assets used in components
    │   │   └── logos/          # Logo variants
    │   └── icons/              # SVG icons and custom icon components
    ├── components/
    │   ├── common/             # Shared UI components
    │   │   ├── ui/             # Basic UI components
    │   │   │   ├── Button.tsx
    │   │   │   ├── Card.tsx
    │   │   │   ├── Checkbox.tsx
    │   │   │   ├── Dropdown.tsx
    │   │   │   ├── FormStep.tsx
    │   │   │   ├── ImageCropper.tsx
    │   │   │   ├── ImagePreview.tsx
    │   │   │   ├── ImageUpload.tsx
    │   │   │   ├── Input.tsx
    │   │   │   ├── LoadingSpinner.tsx
    │   │   │   ├── Modal.tsx
    │   │   │   ├── Radio.tsx
    │   │   │   ├── SearchBar.tsx
    │   │   │   ├── Select.tsx
    │   │   │   ├── StepIndicator.tsx
    │   │   │   ├── Stepper.tsx
    │   │   │   ├── SummaryCard.tsx
    │   │   │   ├── SummaryTable.tsx
    │   │   │   ├── Table.tsx
    │   │   │   ├── Tabs.tsx
    │   │   │   └── Toggle.tsx
    │   │   ├── layout/         # Layout components
    │   │   │   ├── AdminLayout.tsx
    │   │   │   ├── Footer.tsx
    │   │   │   ├── Header.tsx
    │   │   │   ├── NavBar.tsx
    │   │   │   ├── Sidebar.tsx
    │   │   │   └── UserLayout.tsx
    │   │   ├── feedback/       # Feedback components
    │   │   │   ├── EmptyState.tsx
    │   │   │   ├── ErrorMessage.tsx
    │   │   │   ├── Loader.tsx
    │   │   │   ├── Toast.tsx
    │   │   │   └── ValidationError.tsx
    │   │   ├── icons/          # Icon components
    │   │   │   └── SecurityIcon.tsx
    │   │   ├── route/          # Route-related components
    │   │   │   └── ProtectedRoute.tsx
    │   │   └── ErrorBoundary.tsx
    │   ├── auth/               # Authentication components
    │   │   ├── LoginForm.tsx
    │   │   ├── RegisterForm.tsx
    │   │   ├── ProfessionalRegisterForm.tsx
    │   │   ├── ForgotPasswordForm.tsx
    │   │   └── ResetPasswordForm.tsx
    │   ├── marketplace/        # Marketplace components
    │   │   ├── common/          # Shared marketplace components
    │   │   │   ├── ProductCard.tsx
    │   │   │   ├── SearchFilters.tsx
    │   │   │   ├── SortOptions.tsx
    │   │   │   ├── CategoryNav.tsx
    │   │   │   ├── PriceRangeFilter.tsx
    │   │   │   └── FeaturedItems.tsx
    │   │   ├── gemstone/       # Cut gemstone marketplace components
    │   │   │   ├── GemstoneListings.tsx
    │   │   │   ├── GemstoneFilters.tsx
    │   │   │   └── GemstoneCard.tsx
    │   │   ├── rough-stone/    # Rough stone marketplace components
    │   │   │   ├── RoughStoneListings.tsx
    │   │   │   ├── RoughStoneFilters.tsx
    │   │   │   └── RoughStoneCard.tsx
    │   │   ├── jewelry/        # Jewelry marketplace components
    │   │   │   ├── JewelryListings.tsx
    │   │   │   ├── JewelryFilters.tsx
    │   │   │   ├── JewelryCard.tsx
    │   │   │   └── MaterialsFilter.tsx
    │   │   ├── cart/           # Shopping cart components
    │   │   │   ├── CartItem.tsx
    │   │   │   ├── CartSummary.tsx
    │   │   │   └── ShippingForm.tsx
    │   │   ├── checkout/       # Checkout components
    │   │   │   ├── CheckoutForm.tsx
    │   │   │   ├── PaymentForm.tsx
    │   │   │   └── OrderSummary.tsx
    │   │   └── store/          # Store profile components
    │   │       ├── StoreProfile.tsx
    │   │       ├── StoreRatings.tsx
    │   │       └── StoreListing.tsx
    │   ├── user/               # Regular user components
    │   │   ├── profile/        # User profile components
    │   │   │   ├── UserInfo.tsx
    │   │   │   ├── ProfileSettings.tsx
    │   │   │   ├── SecuritySettings.tsx
    │   │   │   └── NotificationSettings.tsx
    │   │   ├── collection/     # User collection components
    │   │   │   ├── GemstoneCollection/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── GemstoneCard.tsx
    │   │   │   │   ├── PublishedGemstones.tsx
    │   │   │   │   └── DraftGemstones.tsx
    │   │   │   ├── RoughStoneCollection/
    │   │   │   │   ├── index.tsx
    │   │   │   │   └── RoughStoneCard.tsx
    │   │   │   └── JewelryCollection/
    │   │   │       ├── index.tsx
    │   │   │       └── JewelryCard.tsx
    │   │   └── orders/         # Order management components
    │   │       ├── OrderList.tsx
    │   │       ├── OrderDetail.tsx
    │   │       └── OrderStatus.tsx
    │   ├── professional/       # Professional user components
    │   │   ├── onboarding/     # Professional onboarding components
    │   │   │   ├── ProfessionalRegistration.tsx
    │   │   │   ├── DocumentUpload.tsx
    │   │   │   ├── ProfileSetup.tsx
    │   │   │   └── VerificationStatus.tsx
    │   │   ├── dashboard/      # Professional dashboard components
    │   │   │   ├── DealerDashboard.tsx
    │   │   │   ├── CutterDashboard.tsx
    │   │   │   ├── AppraiserDashboard.tsx
    │   │   │   └── SalesSummary.tsx
    │   │   ├── inventory/      # Inventory management components
    │   │   │   ├── InventoryList.tsx
    │   │   │   ├── AddInventoryItem.tsx
    │   │   │   └── InventoryDetail.tsx
    │   │   ├── profile/        # Professional profile components
    │   │   │   ├── CutterProfile/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── ExpertiseBadge.tsx
    │   │   │   │   ├── SkillsList.tsx
    │   │   │   │   ├── PortfolioGallery.tsx
    │   │   │   │   └── AddPortfolioItemModal.tsx
    │   │   │   ├── DealerProfile/
    │   │   │   │   ├── index.tsx
    │   │   │   │   └── StoreSettings.tsx
    │   │   │   └── AppraiserProfile/
    │   │   │       ├── index.tsx
    │   │   │       └── CertificationDisplay.tsx
    │   │   └── reviews/        # Review components
    │   │       ├── ReviewDisplay.tsx
    │   │       ├── ReviewsList.tsx
    │   │       └── LeaveReview.tsx
    │   ├── valuation/          # Valuation components
    │   │   ├── common/         # Shared valuation components
    │   │   │   ├── ValuationStepper.tsx
    │   │   │   ├── ImageUploadStep.tsx
    │   │   │   └── SaveControls.tsx
    │   │   ├── gemstone/       # Cut gemstone valuation components
    │   │   │   ├── GemstoneSelector/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── MineralFamilyTab.tsx
    │   │   │   │   ├── ColorCategoryTab.tsx
    │   │   │   │   ├── HardnessTab.tsx
    │   │   │   │   ├── RarityValueTab.tsx
    │   │   │   │   └── SearchResults.tsx
    │   │   │   ├── ColorSelector/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── ColorDetails.tsx
    │   │   │   │   ├── ColorGradeSelector.tsx
    │   │   │   │   └── MunsellColorWheel.tsx
    │   │   │   ├── CutShapeSelector/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── FacetedCutsTab.tsx
    │   │   │   │   ├── CabochonCutsTab.tsx
    │   │   │   │   ├── FantasyCutsTab.tsx
    │   │   │   │   └── ModernCutsTab.tsx
    │   │   │   ├── DetailSelector/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── CaratInput.tsx
    │   │   │   │   ├── DimensionsInput.tsx
    │   │   │   │   ├── MiningInfoInput.tsx
    │   │   │   │   ├── NotesInput.tsx
    │   │   │   │   ├── PieceCountInput.tsx
    │   │   │   │   ├── BlemishSelector.tsx
    │   │   │   │   ├── ClarityCharSelector.tsx
    │   │   │   │   └── TreatmentSelector.tsx
    │   │   │   ├── QualityGrading/
    │   │   │   │   ├── ClaritySelector.tsx
    │   │   │   │   ├── CutGradeSelector.tsx
    │   │   │   │   └── OverallGrade.tsx
    │   │   │   └── ValuationPreview/
    │   │   │       ├── index.tsx
    │   │   │       ├── ColorInfoDisplay.tsx
    │   │   │       ├── GemstoneImagePreview.tsx
    │   │   │       ├── SpecificationsTable.tsx
    │   │   │       ├── ValuationSummary.tsx
    │   │   │       ├── PublishButton.tsx
    │   │   │       └── SaveAsDraftButton.tsx
    │   │   ├── rough-stone/    # Rough stone valuation components
    │   │   │   ├── RoughStoneSelector/
    │   │   │   │   ├── index.tsx
    │   │   │   │   └── RoughTypeSelector.tsx
    │   │   │   ├── RoughQualitySelector/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── ClarityEstimator.tsx
    │   │   │   │   └── PotentialYield.tsx
    │   │   │   ├── RoughDetailsSelector/
    │   │   │   │   ├── index.tsx
    │   │   │   │   ├── WeightEstimator.tsx
    │   │   │   │   ├── OriginSelector.tsx
    │   │   │   │   └── RoughCondition.tsx
    │   │   │   └── RoughValuationPreview/
    │   │   │       ├── index.tsx
    │   │   │       ├── RoughSpecTable.tsx
    │   │   │       ├── RoughValuationSummary.tsx
    │   │   │       └── RoughImagePreview.tsx
    │   │   └── jewelry/        # Jewelry valuation components
    │   │       ├── JewelryTypeSelector/
    │   │       │   ├── index.tsx
    │   │       │   ├── CategorySelector.tsx
    │   │       │   └── StyleSelector.tsx
    │   │       ├── MaterialSelector/
    │   │       │   ├── index.tsx
    │   │       │   ├── MetalTypeSelector.tsx
    │   │       │   ├── PuritySelector.tsx
    │   │       │   ├── GemstoneSelector.tsx
    │   │       │   └── WeightCalculator.tsx
    │   │       ├── CraftsmanshipSelector/
    │   │       │   ├── index.tsx
    │   │       │   ├── WorkmanshipGrade.tsx
    │   │       │   ├── DesignComplexity.tsx
    │   │       │   └── FinishQuality.tsx
    │   │       └── JewelryValuationPreview/
    │   │           ├── index.tsx
    │   │           ├── JewelrySpecTable.tsx
    │   │           ├── MaterialsBreakdown.tsx
    │   │           ├── JewelryValuationSummary.tsx
    │   │           └── JewelryImagePreview.tsx
    │   ├── transfer/           # Ownership transfer components
    │   │   ├── Ownership/
    │   │   │   ├── TransferOwnership.tsx
    │   │   │   ├── TransferConfirmation.tsx
    │   │   │   └── TransferHistory.tsx
    │   │   ├── initiate/       # Transfer initiation components
    │   │   │   ├── InitiateTransfer.tsx
    │   │   │   ├── RecipientSelection.tsx
    │   │   │   └── TransferTerms.tsx
    │   │   ├── receive/        # Transfer receiving components
    │   │   │   ├── PendingTransfers.tsx
    │   │   │   ├── TransferDetails.tsx
    │   │   │   └── AcceptTransfer.tsx
    │   │   └── history/        # Transfer history components
    │   │       ├── TransferList.tsx
    │   │       ├── TransferTimeline.tsx
    │   │       └── ProvenanceTree.tsx
    │   └── certificate/        # Certificate components
    │       ├── generation/     # Certificate generation components
    │       │   ├── CertificateGenerator.tsx
    │       │   ├── CertificateTemplate.tsx
    │       │   └── BlockchainRecorder.tsx
    │       ├── verification/   # Certificate verification components
    │       │   ├── CertificateVerifier.tsx
    │       │   ├── BlockchainVerification.tsx
    │       │   └── QRCodeScanner.tsx
    │       └── display/        # Certificate display components
    │           ├── CertificateViewer.tsx
    │           ├── CertificateDownload.tsx
    │           └── CertificateSharing.tsx
    ├── contexts/               # React context providers
    │   ├── AuthContext.tsx     # Authentication context
    │   ├── UIContext.tsx       # UI state context
    │   ├── ThemeContext.tsx    # Theme customization context
    │   ├── GemstoneSelectorContext.tsx # For gemstone wizard
    │   ├── GemstoneValuationContext.tsx # For valuation state
    │   ├── RoughStoneContext.tsx # For rough stone valuation
    │   ├── JewelryContext.tsx  # For jewelry valuation
    │   ├── MarketplaceContext.tsx # For marketplace state
    │   ├── CartContext.tsx     # For shopping cart
    │   └── ToastContext.tsx    # For notifications
    ├── hooks/                  # Custom React hooks
    │   ├── useAuth.ts          # Authentication hook
    │   ├── useForm.ts          # Form handling hook
    │   ├── useFormValidation.ts # Form validation hook
    │   ├── useApi.ts           # API communication hook
    │   ├── useLocalStorage.ts  # Local storage hook
    │   ├── useGemstoneMatcher.ts # Gemstone matching hook
    │   ├── useGemstoneValuation.ts # Valuation state hook
    │   ├── useRoughStoneValuation.ts # Rough stone hook
    │   ├── useJewelryValuation.ts # Jewelry valuation hook
    │   ├── useTransfer.ts      # Transfer process hook
    │   ├── useCertificate.ts   # Certificate handling hook
    │   └── useColor.ts         # Color utility hook
    ├── pages/                  # Page components
    │   ├── Home.tsx            # Homepage
    │   ├── Search.tsx          # Search results page
    │   ├── Auth/               # Authentication pages
    │   │   ├── Login.tsx       # Login page
    │   │   ├── Register.tsx    # Regular user registration
    │   │   ├── ProfessionalRegister.tsx # Professional registration
    │   │   ├── ForgotPassword.tsx # Password recovery request
    │   │   ├── ResetPassword.tsx # Password reset page
    │   │   └── VerifyEmail.tsx # Email verification page
    │   ├── Marketplace/        # Marketplace pages
    │   │   ├── Browse.tsx      # Main marketplace browse page
    │   │   ├── Category.tsx    # Category-specific browse page
    │   │   ├── GemstoneDetail.tsx # Cut gemstone detail page
    │   │   ├── RoughStoneDetail.tsx # Rough stone detail page
    │   │   ├── JewelryDetail.tsx # Jewelry detail page
    │   │   ├── Cart.tsx        # Shopping cart page
    │   │   ├── Checkout.tsx    # Checkout page
    │   │   ├── OrderConfirmation.tsx # Order confirmation
    │   │   └── StoreView.tsx   # Seller store page
    │   ├── Valuation/          # Valuation pages
    │   │   ├── ValuationHome.tsx # Valuation landing page
    │   │   ├── GemstoneWizard.tsx # Cut gemstone valuation
    │   │   ├── RoughStoneWizard.tsx # Rough stone valuation
    │   │   └── JewelryWizard.tsx # Jewelry valuation
    │   ├── Profile/            # Profile pages
    │   │   ├── Dashboard.tsx   # User dashboard
    │   │   ├── Collection.tsx  # User's collection
    │   │   ├── MyGemstones.tsx # User's gemstones
    │   │   ├── MyRoughStones.tsx # User's rough stones
    │   │   ├── MyJewelry.tsx   # User's jewelry
    │   │   ├── MyDrafts.tsx    # Draft valuations
    │   │   ├── Orders.tsx      # User's orders
    │   │   ├── Settings.tsx    # User settings
    │   │   └── Transfers.tsx   # Ownership transfers
    │   ├── Professional/       # Professional pages
    │   │   ├── Dashboard.tsx   # Professional dashboard
    │   │   ├── Inventory.tsx   # Inventory management
    │   │   ├── Sales.tsx       # Sales management
    │   │   ├── Customers.tsx   # Customer management
    │   │   ├── Analytics.tsx   # Business analytics
    │   │   ├── Reviews.tsx     # Professional reviews
    │   │   └── Settings.tsx    # Professional settings
    │   ├── Certificate/        # Certificate pages
    │   │   ├── CertificateView.tsx # Certificate view page
    │   │   └── Verify.tsx      # Certificate verification
    │   ├── Cutters/            # Cutter pages
    │   │   ├── AllCutters.tsx  # List of cutters
    │   │   └── CutterDetail.tsx # Cutter profile detail
    │   └── NotFound.tsx        # 404 page
    ├── routes/                 # Routing configuration
    │   ├── AppRoutes.tsx       # Main route configuration
    │   ├── UserRoutes.tsx      # User route definitions
    │   ├── ProfessionalRoutes.tsx # Professional routes
    │   ├── MarketplaceRoutes.tsx # Marketplace routes
    │   └── CertificateRoutes.tsx # Certificate routes
    ├── services/               # Service modules
    │   ├── api/                # API service modules
    │   │   ├── api.service.ts  # Base API service
    │   │   ├── auth.service.ts # Authentication API service
    │   │   ├── user.service.ts # User API service
    │   │   ├── gemstone.service.ts # Gemstone API service
    │   │   ├── gemstone-draft.service.ts # Draft API service
    │   │   ├── rough-stone.service.ts # Rough stone API service
    │   │   ├── jewelry.service.ts # Jewelry API service
    │   │   ├── professional.service.ts # Professional API service
    │   │   ├── marketplace.service.ts # Marketplace API service
    │   │   ├── valuation.service.ts # Valuation API service
    │   │   ├── transfer.service.ts # Transfer API service
    │   │   ├── certificate.service.ts # Certificate API service
    │   │   ├── blockchain.service.ts # Blockchain API service
    │   │   ├── upload.service.ts # File upload service
    │   │   ├── reference-data.service.ts # Reference data service
    │   │   └── csrf.service.ts # CSRF protection service
    │   ├── storage/            # Local storage services
    │   │   ├── localStorage.service.ts
    │   │   └── sessionStorage.service.ts
    │   ├── notifications/      # Notification services
    │   │   └── toast.service.ts
    │   └── util/               # Utility services
    │       ├── color.service.ts
    │       ├── formatter.service.ts
    │       └── valuation.service.ts
    ├── types/                  # TypeScript type definitions
    │   ├── gemstone.types.ts   # Gemstone-related types
    │   ├── rough-stone.types.ts # Rough stone types
    │   ├── jewelry.types.ts    # Jewelry-related types
    │   ├── user.types.ts       # User-related types
    │   ├── professional.types.ts # Professional types
    │   ├── marketplace.types.ts # Marketplace types
    │   ├── certificate.types.ts # Certificate types
    │   ├── transfer.types.ts   # Transfer-related types
    │   ├── blockchain.types.ts # Blockchain types
    │   ├── color.types.ts      # Color-related types
    │   ├── api.types.ts        # API-related types
    │   └── validation.types.ts # Validation types
    └── utils/                  # Utility functions
        ├── validation.ts       # Form validation
        ├── formatting.ts       # Text formatting
        ├── helpers.ts          # General helpers
        ├── permissions.ts      # Permission helpers
        ├── errorHandling.ts    # Error handling
        ├── gemstoneStateHelpers.ts # Gemstone state helpers
        ├── certificateGeneration.ts # Certificate generation
        ├── colorConversion.ts  # Color conversion
        └── idGeneration.ts     # ID generation for items
```

## Backend Structure (Node.js/Express with Tailwind CSS for Admin Panel)

```
packages/backend/
├── .env.development            # Development environment variables
├── .env.production             # Production environment variables
├── .gitignore
├── package.json                # Dependencies for backend and admin panel
├── tsconfig.json               # TypeScript configuration
├── nodemon.json                # Nodemon configuration
├── jest.config.js              # Jest configuration
├── tailwind.config.js          # Tailwind CSS configuration for admin panel
├── postcss.config.js           # PostCSS configuration for Tailwind
├── public/                     # Static files
│   ├── uploads/                # Uploaded files
│   │   ├── gemstones/          # Gemstone images
│   │   ├── rough-stones/       # Rough stone images
│   │   ├── jewelry/            # Jewelry images
│   │   ├── documents/          # Verification documents
│   │   ├── users/              # User avatars
│   │   └── temp/               # Temporary uploads
│   └── admin/                  # Admin panel static assets
│       ├── css/                # CSS files
│       │   ├── tailwind.css    # Compiled Tailwind CSS
│       │   └── custom.css      # Custom admin styles
│       ├── js/                 # JavaScript files
│       │   ├── admin.js        # Admin panel scripts
│       │   └── charts.js       # Chart visualizations
│       └── images/             # Admin panel images
└── src/
    ├── index.ts                # Application entry point
    ├── server.ts               # Server configuration
    ├── config/                 # Configuration
    │   ├── database.ts         # Database connection
    │   ├── environment.ts      # Environment variables
    │   ├── cors.ts             # CORS configuration
    │   ├── admin.config.ts     # Admin panel configuration
    │   ├── storage.ts          # File storage configuration
    │   ├── auth.ts             # Authentication configuration
    │   ├── tailwind.ts         # Tailwind CSS configuration for admin
    │   └── blockchain.ts       # Blockchain configuration
    ├── api/                    # API endpoints (for frontend)
    │   ├── routes/             # Route definitions
    │   │   ├── index.ts        # Route aggregator
    │   │   ├── auth.routes.ts  # Authentication routes
    │   │   ├── user.routes.ts  # User routes
    │   │   ├── gemstone.routes.ts # Gemstone routes
    │   │   ├── gemstone-draft.routes.ts # Draft routes
    │   │   ├── rough-stone.routes.ts # Rough stone routes
    │   │   ├── jewelry.routes.ts # Jewelry routes
    │   │   ├── professional.routes.ts # Professional routes
    │   │   ├── marketplace.routes.ts # Marketplace routes
    │   │   ├── verification.routes.ts # Verification routes
    │   │   ├── transfer.routes.ts # Transfer routes
    │   │   ├── certificate.routes.ts # Certificate routes
    │   │   ├── blockchain.routes.ts # Blockchain routes
    │   │   ├── upload.routes.ts # Upload routes
    │   │   ├── reference-data.routes.ts # Reference data routes
    │   │   └── valuation.routes.ts # Valuation routes
    │   ├── controllers/        # Route controllers
    │   │   ├── auth.controller.ts
    │   │   ├── user.controller.ts
    │   │   ├── gemstone.controller.ts
    │   │   ├── gemstone-draft.controller.ts
    │   │   ├── rough-stone.controller.ts
    │   │   ├── jewelry.controller.ts
    │   │   ├── professional.controller.ts
    │   │   ├── verification.controller.ts
    │   │   ├── marketplace.controller.ts
    │   │   ├── transfer.controller.ts
    │   │   ├── certificate.controller.ts
    │   │   ├── blockchain.controller.ts
    │   │   ├── upload.controller.ts
    │   │   ├── reference-data.controller.ts
    │   │   └── valuation.controller.ts
    │   ├── middlewares/        # API middlewares
    │   │   ├── auth.middleware.ts
    │   │   ├── role.middleware.ts
    │   │   ├── validation.middleware.ts
    │   │   ├── error.middleware.ts
    │   │   ├── upload.middleware.ts
    │   │   ├── audit.middleware.ts
    │   │   └── csrf.middleware.ts
    │   └── validators/         # Request validators
    │       ├── auth.validator.ts
    │       ├── user.validator.ts
    │       ├── gemstone.validator.ts
    │       ├── rough-stone.validator.ts
    │       ├── jewelry.validator.ts
    │       ├── professional.validator.ts
    │       ├── transfer.validator.ts
    │       ├── certificate.validator.ts
    │       └── marketplace.validator.ts
    ├── admin/                  # Admin panel (server-rendered)
    │   ├── assets/             # Admin panel assets
    │   │   ├── css/            # Admin CSS files
    │   │   │   ├── admin.css   # Admin-specific CSS
    │   │   │   └── tailwind.css # Tailwind CSS for admin
    │   │   └── js/             # Admin JavaScript files
    │   │       ├── admin.js    # Admin-specific JavaScript
    │   │       └── charts.js   # Chart visualizations
    │   ├── routes/             # Admin routes
    │   │   ├── index.ts        # Admin route aggregator
    │   │   ├── dashboard.routes.ts # Dashboard routes
    │   │   ├── user.routes.ts  # User management routes
    │   │   ├── professional.routes.ts # Professional management
    │   │   ├── verification.routes.ts # Document verification
    │   │   ├── gemstone.routes.ts # Gemstone management routes
    │   │   ├── rough-stone.routes.ts # Rough stone management
    │   │   ├── jewelry.routes.ts # Jewelry management
    │   │   ├── marketplace.routes.ts # Marketplace management
    │   │   ├── certification.routes.ts # Certificate management
    │   │   ├── reference-data.routes.ts # Reference data routes
    │   │   └── system.routes.ts # System settings routes
    │   ├── controllers/        # Admin controllers
    │   │   ├── dashboard.controller.ts
    │   │   ├── user.controller.ts
    │   │   ├── professional.controller.ts
    │   │   ├── verification.controller.ts
    │   │   ├── gemstone.controller.ts
    │   │   ├── rough-stone.controller.ts
    │   │   ├── jewelry.controller.ts
    │   │   ├── marketplace.controller.ts
    │   │   ├── certification.controller.ts
    │   │   ├── reference-data.controller.ts
    │   │   └── system.controller.ts
    │   ├── middlewares/        # Admin middlewares
    │   │   ├── admin-auth.middleware.ts
    │   │   └── admin-validators.middleware.ts
    │   └── views/              # EJS templates for admin panel
    │       ├── layouts/
    │       │   └── main.ejs    # Main layout template with Tailwind
    │       ├── partials/
    │       │   ├── header.ejs
    │       │   ├── sidebar.ejs
    │       │   └── footer.ejs
    │       ├── auth/
    │       │   ├── login.ejs
    │       │   ├── change-password.ejs
    │       │   ├── setup-mfa.ejs
    │       │   └── verify-mfa.ejs
    │       ├── dashboard/
    │       │   └── index.ejs
    │       ├── users/
    │       │   ├── list.ejs
    │       │   ├── create.ejs
    │       │   ├── edit.ejs
    │       │   └── details.ejs
    │       ├── professionals/
    │       │   ├── list.ejs
    │       │   ├── pending.ejs
    │       │   ├── details.ejs
    │       │   └── documents.ejs
    │       ├── gemstones/
    │       │   ├── list.ejs
    │       │   ├── approval.ejs
    │       │   └── details.ejs
    │       ├── rough-stones/
    │       │   ├── list.ejs
    │       │   ├── approval.ejs
    │       │   └── details.ejs
    │       ├── jewelry/
    │       │   ├── list.ejs
    │       │   ├── approval.ejs
    │       │   └── details.ejs
    │       ├── marketplace/
    │       │   ├── listings.ejs
    │       │   ├── orders.ejs
    │       │   └── statistics.ejs
    │       ├── certificates/
    │       │   ├── list.ejs
    │       │   ├── details.ejs
    │       │   └── verify.ejs
    │       ├── reference-data/
    │       │   ├── gemstone-families.ejs
    │       │   ├── gemstone-family-form.ejs
    │       │   ├── cut-shapes.ejs
    │       │   ├── colors.ejs
    │       │   ├── jewelry-types.ejs
    │       │   ├── materials.ejs
    │       │   ├── quality-standards.ejs
    │       │   └── mining-locations.ejs
    │       ├── system/
    │       │   ├── settings.ejs
    │       │   ├── audit-log.ejs
    │       │   └── backup.ejs
    │       └── error.ejs
    ├── db/
    │   ├── index.ts            # Database connection setup
    │   ├── repositories/       # Database repositories
    │   │   ├── user.repository.ts
    │   │   ├── professional.repository.ts
    │   │   ├── gemstone.repository.ts
    │   │   ├── gemstone-draft.repository.ts
    │   │   ├── rough-stone.repository.ts
    │   │   ├── jewelry.repository.ts
    │   │   ├── marketplace.repository.ts
    │   │   ├── transfer.repository.ts
    │   │   ├── certificate.repository.ts
    │   │   ├── blockchain.repository.ts
    │   │   ├── reference-data.repository.ts
    │   │   ├── attribute.repository.ts
    │   │   ├── system-settings.repository.ts
    │   │   └── audit.repository.ts
    │   └── models/             # Database models
    │       ├── user.model.ts
    │       ├── professional.model.ts
    │       ├── verification.model.ts
    │       ├── gemstone.model.ts
    │       ├── rough-stone.model.ts
    │       ├── jewelry.model.ts
    │       ├── material.model.ts
    │       ├── gemstone-family.model.ts
    │       ├── cut-shape.model.ts
    │       ├── color.model.ts
    │       ├── quality.model.ts
    │       ├── mining-location.model.ts
    │       ├── transfer.model.ts
    │       ├── certificate.model.ts
    │       ├── blockchain-record.model.ts
    │       ├── marketplace.model.ts
    │       ├── order.model.ts
    │       ├── review.model.ts
    │       ├── system-settings.model.ts
    │       └── audit.model.ts
    ├── services/               # Business logic services
    │   ├── auth.service.ts
    │   ├── user.service.ts
    │   ├── professional.service.ts
    │   ├── verification.service.ts
    │   ├── gemstone.service.ts
    │   ├── gemstone-draft.service.ts
    │   ├── rough-stone.service.ts
    │   ├── jewelry.service.ts
    │   ├── marketplace.service.ts
    │   ├── order.service.ts
    │   ├── valuation.service.ts
    │   ├── transfer.service.ts
    │   ├── certificate.service.ts
    │   ├── blockchain.service.ts
    │   ├── reference-data.service.ts
    │   ├── admin.service.ts
    │   ├── search.service.ts
    │   ├── email.service.ts
    │   ├── file.service.ts
    │   ├── system.service.ts
    │   └── audit.service.ts
    ├── types/                  # TypeScript type definitions
    │   ├── express.types.ts    # Express request/response types
    │   ├── express-extensions.ts
    │   ├── express-middleware.d.ts
    │   ├── express-session.ts
    │   ├── request.types.ts
    │   ├── user.types.ts       # User-related types
    │   ├── professional.types.ts # Professional types
    │   ├── gemstone.types.ts   # Gemstone-related types
    │   ├── rough-stone.types.ts # Rough stone types
    │   ├── jewelry.types.ts    # Jewelry types
    │   ├── material.types.ts   # Material types
    │   ├── marketplace.types.ts # Marketplace types
    │   ├── order.types.ts      # Order types
    │   ├── transfer.types.ts   # Transfer-related types
    │   ├── certificate.types.ts # Certificate types
    │   ├── blockchain.types.ts # Blockchain types
    │   ├── reference-data.types.ts # Reference data types
    │   └── system.types.ts     # System-related types
    └── utils/                  # Utility functions
        ├── logger.ts           # Logging utility
        ├── errorHandler.ts     # Error handling
        ├── encryption.ts       # Password encryption
        ├── validators.ts       # Data validation helpers
        ├── responseFormatter.ts # API response formatting
        ├── idGenerator.ts      # Unique ID generation
        ├── certificateBuilder.ts # Certificate generation
        ├── blockchainHelper.ts # Blockchain helpers
        └── imageProcessor.ts   # Image processing
```

## Database Structure (PostgreSQL)

```
database/
├── migrations/                 # Database migration files
│   ├── 001_initial_schema.sql
│   ├── 002_user_roles.sql
│   ├── 003_gemstone_tables.sql
│   ├── 004_rough_stone_tables.sql
│   ├── 005_jewelry_tables.sql
│   ├── 006_professional_tables.sql
│   ├── 007_marketplace_tables.sql
│   ├── 008_ownership_transfer.sql
│   ├── 009_certificate_system.sql
│   ├── 010_blockchain_records.sql
│   ├── 011_audit_system.sql
│   └── 012_system_settings.sql
├── scripts/
│   ├── backup.sh               # Database backup script
│   ├── restore.sh              # Database restore script
│   ├── setup.sh                # Database setup script
│   └── seed-data.sh            # Data seeding script
├── schema/
│   ├── tables/                 # Table definitions
│   │   ├── users.sql
│   │   ├── roles.sql
│   │   ├── permissions.sql
│   │   ├── professionals.sql
│   │   ├── professional_types.sql
│   │   ├── verification_documents.sql
│   │   ├── gemstones.sql
│   │   ├── rough_stones.sql
│   │   ├── jewelry_items.sql
│   │   ├── materials.sql
│   │   ├── gemstone_families.sql
│   │   ├── cut_shapes.sql
│   │   ├── colors.sql
│   │   ├── color_grades.sql
│   │   ├── clarity_grades.sql
│   │   ├── quality_standards.sql
│   │   ├── mining_locations.sql
│   │   ├── marketplace_listings.sql
│   │   ├── orders.sql
│   │   ├── order_items.sql
│   │   ├── reviews.sql
│   │   ├── ownership_transfers.sql
│   │   ├── certificates.sql
│   │   ├── blockchain_records.sql
│   │   ├── system_settings.sql
│   │   └── audit_logs.sql
│   ├── views/                  # Database views
│   │   ├── gemstone_full_details.sql
│   │   ├── rough_stone_details.sql
│   │   ├── jewelry_details.sql
│   │   ├── user_inventory.sql
│   │   ├── professional_listings.sql
│   │   ├── transfer_history.sql
│   │   ├── certificate_details.sql
│   │   └── admin_dashboard.sql
│   ├── functions/              # Database functions
│   │   ├── search_items.sql
│   │   ├── calculate_gemstone_value.sql
│   │   ├── calculate_rough_value.sql
│   │   ├── calculate_jewelry_value.sql
│   │   ├── generate_unique_id.sql
│   │   ├── generate_certificate.sql
│   │   ├── transfer_ownership.sql
│   │   ├── verify_blockchain_record.sql
│   │   └── audit_trigger.sql
│   ├── indexes/                # Database indexes
│   │   ├── gemstone_indexes.sql
│   │   ├── rough_stone_indexes.sql
│   │   ├── jewelry_indexes.sql
│   │   ├── user_indexes.sql
│   │   ├── marketplace_indexes.sql
│   │   ├── search_indexes.sql
│   │   └── certificate_indexes.sql
│   └── triggers/               # Database triggers
│       ├── audit_triggers.sql
│       ├── transfer_triggers.sql
│       └── certificate_triggers.sql
├── backups/                    # Directory for database backups
└── seed/                       # Seed data
    ├── gemstone_families.json
    ├── cut_shapes.json
    ├── colors.json
    ├── clarity_grades.json
    ├── quality_standards.json
    ├── mining_locations.json
    ├── materials.json
    ├── jewelry_types.json
    ├── admin_users.json
    └── test_data.json