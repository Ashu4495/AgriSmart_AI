"""
Agricultural Knowledge Base (RAG Data) for AgriSmart AI Assistant.
Contains verified agronomic information covering:
1. Major Indian crop cultivation guides
2. Nutrient deficiency symptoms & corrective measures
3. Plant pest & disease protocols, bio-controls, IPM
4. Soil health, composting & fertilizer management
5. Indian agricultural government schemes (PM-KISAN, PMFBY, KCC, Soil Health Card, PMKSY)
"""

AGRONOMIC_KNOWLEDGE_BASE = [
    # -------------------------------------------------------------------------
    # 1. CROP CULTIVATION GUIDES
    # -------------------------------------------------------------------------
    {
        
        "id": "crop_wheat",
        "category": "crop_cultivation",
        "title": "Wheat Cultivation (Triticum aestivum)",
        "keywords": ["wheat", "gehun", "gehu", "rabi", "sowing", "irrigation", "yield"],
        "content": (
            "Wheat is the premier Rabi cereal crop in India. Optimal sowing time is November 1 to November 25. "
            "Seed Rate: 100 kg/ha for normal sowing, 125 kg/ha for late sowing. Spacing: 20-22.5 cm between rows. "
            "Fertilizer NPK Dosage: 120:60:40 kg/ha. Apply 50% Nitrogen and 100% Phosphorus and Potassium as basal dose at sowing. "
            "Apply remaining Nitrogen in two equal splits: 1st at Crown Root Initiation (CRI) stage (21 days after sowing) "
            "and 2nd at Flowering/Tillering stage. "
            "Critical Irrigation Stages: CRI (20-25 DAS), Tillering (40-45 DAS), Late Jointing (60-65 DAS), "
            "Flowering (80-85 DAS), and Dough/Grain filling (100-105 DAS). "
            "Expected Yield: 40-55 quintals/hectare."
        ),
    },
    {
        "id": "crop_rice",
        "category": "crop_cultivation",
        "title": "Paddy / Rice Cultivation (Oryza sativa)",
        "keywords": ["rice", "paddy", "dhan", "kharif", "nursery", "transplanting", "water"],
        "content": (
            "Rice is the primary Kharif staple crop. Nursery sowing occurs in May-June, and transplanting at 21-25 days old seedlings. "
            "Seed Rate: 20-25 kg/ha for transplanted rice, 7-8 kg/ha for SRI method, 40-50 kg/ha for direct seeded rice (DSR). "
            "Spacing: 20x15 cm or 15x15 cm (2-3 seedlings per hill). "
            "Fertilizer NPK: 100-120:50-60:40-50 kg/ha + 25 kg/ha Zinc Sulphate. "
            "Water Management: Maintain 2-5 cm standing water during tillering and panicle initiation. Drain field 10 days before harvest. "
            "Expected Yield: 45-65 quintals/hectare."
        ),
    },
    {
        "id": "crop_cotton",
        "category": "crop_cultivation",
        "title": "Cotton Cultivation (Gossypium hirsutum)",
        "keywords": ["cotton", "kapas", "black soil", "kharif", "bollworm", "spacing"],
        "content": (
            "Cotton is an important fiber cash crop suited to deep black soils (Vertisols) and well-drained loams. "
            "Sowing Window: April-May for North India, June-July (with monsoon onset) for Central and South India. "
            "Seed Rate: 2.5-3.0 kg/ha for Bt Hybrid Cotton. Spacing: 90x60 cm or 120x45 cm. "
            "Fertilizer NPK: 120:60:60 kg/ha. Apply N in 3 splits (basal, square formation, and boll development). "
            "Pest Management: Monitor for sucking pests (aphids, thrips, jassids) and pink bollworm using pheromone traps (5 traps/acre). "
            "Expected Yield: 20-30 quintals/hectare (seed cotton)."
        ),
    },
    {
        "id": "crop_chickpea",
        "category": "crop_cultivation",
        "title": "Gram / Chickpea Cultivation (Cicer arietinum)",
        "keywords": ["gram", "chana", "chickpea", "pulse", "rabi", "rhizobium"],
        "content": (
            "Chickpea (Chana) is the largest pulse crop in India, thriving in cool, dry climate and loamy/clay-loam soils. "
            "Sowing Window: October 15 to November 15. "
            "Seed Rate: 75-80 kg/ha for Desi varieties, 100-120 kg/ha for Kabuli varieties. "
            "Seed Treatment: Treat seed with Trichoderma viride (4g/kg) and biofertilizers (Rhizobium + PSB @ 20g/kg seed). "
            "Fertilizer NPK: 20:50:20 kg/ha + 20 kg Sulphur/ha as basal dose. Being a legume, it fixes its own atmospheric Nitrogen. "
            "Irrigation: 1-2 irrigations (at branching and pod development). Avoid irrigation during active flowering. "
            "Expected Yield: 18-25 quintals/hectare."
        ),
    },
    {
        "id": "crop_mustard",
        "category": "crop_cultivation",
        "title": "Mustard / Rapeseed Cultivation (Brassica juncea)",
        "keywords": ["mustard", "sarson", "rai", "oilseed", "rabi", "sulphur"],
        "content": (
            "Mustard is the leading Rabi oilseed crop. Optimal sowing time is September 25 to October 20. "
            "Seed Rate: 4-5 kg/ha. Sowing depth: 2-3 cm. Spacing: 30x10 cm. "
            "Fertilizer NPK: 80:40:40 kg/ha. Crucial: Apply 20-30 kg/ha elemental Sulphur or Gypsum to boost seed oil content. "
            "Irrigation: 2 irrigations: 1st at flowering stage (30-35 DAS) and 2nd at siliqua (pod) filling stage (60-65 DAS). "
            "Aphid Management: Spray Dimethoate 30 EC @ 1.5 ml/L or 5% Neem Seed Kernel Extract (NSKE) if aphid colony exceeds threshold. "
            "Expected Yield: 18-24 quintals/hectare."
        ),
    },
    {
        "id": "crop_maize",
        "category": "crop_cultivation",
        "title": "Maize Cultivation (Zea mays)",
        "keywords": ["maize", "makka", "corn", "kharif", "rabi", "fall armyworm"],
        "content": (
            "Maize is a versatile cereal adaptable to Kharif, Rabi, and Spring seasons. "
            "Seed Rate: 20 kg/ha for hybrid grain maize, 25 kg/ha for composite. Spacing: 60x20 cm. "
            "Fertilizer NPK: 120-150:60:40 kg/ha + 25 kg/ha Zinc Sulphate. Apply N in 3 splits (basal, knee-high stage, and tasseling stage). "
            "Critical Stages: Knee-high (30 DAS), Tasseling (45-50 DAS), and Silking/Grain filling (65-70 DAS). Avoid waterlogging. "
            "Fall Armyworm (FAW) Management: Apply whorl application of Emamectin benzoate 5% SG @ 0.4g/L or Beauveria bassiana. "
            "Expected Yield: 50-70 quintals/hectare."
        ),
    },
    {
        "id": "crop_tomato",
        "category": "crop_cultivation",
        "title": "Tomato Cultivation (Solanum lycopersicum)",
        "keywords": ["tomato", "tamatar", "vegetable", "staking", "blight", "nursery"],
        "content": (
            "Tomato is a high-value solanaceous vegetable. Nursery duration: 25-30 days before field transplanting. "
            "Seed Rate: 100-150 g/ha for hybrids, 400 g/ha for open-pollinated. Spacing: 60x45 cm or 75x60 cm with staking. "
            "Fertilizer NPK: 150:100:120 kg/ha + 25 tonnes/ha FYM. Apply Potassium in splits to improve fruit firmness and shelf life. "
            "Irrigation: Drip irrigation with fertigation is recommended. Maintain consistent moisture to prevent Blossom End Rot. "
            "Expected Yield: 400-800 quintals/hectare."
        ),
    },

    # -------------------------------------------------------------------------
    # 2. NUTRIENT DEFICIENCIES & FERTILIZER MANAGEMENT
    # -------------------------------------------------------------------------
    {
        "id": "deficiency_nitrogen",
        "category": "nutrient_deficiency",
        "title": "Nitrogen (N) Deficiency in Crops",
        "keywords": ["nitrogen", "urea", "yellowing", "deficiency", "chlorosis", "stunted growth"],
        "content": (
            "Symptoms: General yellowing (chlorosis) starting uniformly on older/lower leaves while upper leaves stay pale green. "
            "Stunted plant growth, thin stems, reduced tillering in cereals, and premature leaf drop. "
            "Causes: Low soil organic matter, leaching in sandy soils due to excessive rain/irrigation, or cold root conditions. "
            "Remedy: 1) Soil application of Urea (40-50 kg/ha) or Neem Coated Urea. "
            "2) Immediate correction via foliar spray of 1.5% to 2.0% Urea solution (15-20g Urea per liter water). "
            "3) Long-term: Incorporate well-decomposed FYM (5 tonnes/acre) or green manure (Dhaincha/Sunhemp)."
        ),
    },
    {
        "id": "deficiency_phosphorus",
        "category": "nutrient_deficiency",
        "title": "Phosphorus (P) Deficiency in Crops",
        "keywords": ["phosphorus", "dap", "ssp", "purple leaves", "root development"],
        "content": (
            "Symptoms: Purplish or dark bronze discoloration along leaf margins and veins on older leaves. "
            "Poor root establishment, delayed flowering, thin stalks, and poor grain setting. "
            "Causes: Acidic (pH < 6.0) or strongly alkaline (pH > 8.0) soils which fix phosphorus into insoluble forms. "
            "Remedy: 1) Apply Single Super Phosphate (SSP) or Di-Ammonium Phosphate (DAP) at root zone as basal dose. "
            "2) Foliar spray of 19:19:19 or 12:61:00 (Mono-Ammonium Phosphate) @ 5g/L water. "
            "3) Apply Phosphate Solubilizing Bacteria (PSB @ 2 kg/acre mixed with 100 kg FYM) to release fixed soil phosphorus."
        ),
    },
    {
        "id": "deficiency_potassium",
        "category": "nutrient_deficiency",
        "title": "Potassium (K) Deficiency in Crops",
        "keywords": ["potassium", "mop", "leaf scorch", "lodging", "drought resistance"],
        "content": (
            "Symptoms: Marginal chlorosis followed by burning/scorch (firing) along the tips and outer edges of older leaves. "
            "Weak stems prone to lodging, low disease resistance, poor grain filling, and fruit shrinking. "
            "Causes: Light sandy soils, heavy leaching, or high magnesium/calcium competition. "
            "Remedy: 1) Soil application of Muriate of Potash (MOP / KCl) @ 30-50 kg/ha or SOP (Sulphate of Potash). "
            "2) Foliar spray of Potassium Nitrate (13:00:45) @ 10g/L during flowering/fruit enlargement. "
            "3) Helps plants withstand moisture and heat stress."
        ),
    },
    {
        "id": "deficiency_zinc_iron",
        "category": "nutrient_deficiency",
        "title": "Zinc (Zn) & Iron (Fe) Micronutrient Deficiencies",
        "keywords": ["zinc", "iron", "micronutrient", "interveinal chlorosis", "khaira", "chelate"],
        "content": (
            "Zinc Deficiency Symptoms: 'Khaira' disease in paddy with brown-bronze spots on middle leaves; white bud/stripes in maize; "
            "interveinal chlorosis with small clustered leaves (little leaf). "
            "Iron Deficiency Symptoms: Interveinal chlorosis appearing on the YOUNGEST top leaves (veins remain green, tissue turns yellow/white). "
            "Remedy for Zinc: Soil application of Zinc Sulphate 21% @ 25 kg/ha or 33% @ 15 kg/ha; or foliar spray of Chelated Zinc (Zn-EDTA 12%) @ 1g/L. "
            "Remedy for Iron: Foliar spray of Ferrous Sulphate (FeSO4 19%) @ 5g/L + 1g Citric Acid; or Fe-EDTA 12% @ 1.5g/L."
        ),
    },
    {
        "id": "soil_health_improvement",
        "category": "soil_management",
        "title": "Improving Soil Health & Organic Carbon",
        "keywords": ["soil health", "organic carbon", "compost", "fym", "vermicompost", "ph"],
        "content": (
            "Methods to naturally boost soil fertility and biological activity: "
            "1) Organic Manuring: Apply 5 tonnes/acre of well-rotted Farmyard Manure (FYM) or 2 tonnes/acre of Vermicompost before land preparation. "
            "2) Green Manuring: Sow Dhaincha (Sesbania) or Sunhemp in summer and incorporate into the soil at 45 days (adds 20-25 kg N/ha). "
            "3) Crop Rotation: Alternate cereal crops (exhausters) with pulses/legumes (chickpea, mungbean) to fix atmospheric nitrogen. "
            "4) pH Correction: For acidic soils (pH < 6.0), apply agricultural lime / dolomite @ 1-2 tonnes/ha. "
            "For saline/alkaline soils (pH > 8.2), apply agricultural Gypsum (CaSO4) @ 2-3 tonnes/ha followed by flooding and leaching."
        ),
    },

    # -------------------------------------------------------------------------
    # 3. PEST & DISEASE MANAGEMENT (IPM)
    # -------------------------------------------------------------------------
    {
        "id": "disease_wheat_rust",
        "category": "plant_pathology",
        "title": "Wheat Leaf & Yellow Rust (Puccinia species)",
        "keywords": ["rust", "wheat rust", "puccinia", "yellow spots", "fungal"],
        "content": (
            "Symptoms: Yellow Rust displays bright yellow pustules arranged in linear stripes on leaf blades. "
            "Brown/Leaf Rust shows round to oval orange-brown scattered pustules on leaves. "
            "Conditions: Humid weather, temperatures 15-25°C, and morning dew. "
            "Management: 1) Grow resistant wheat varieties (HD-2967, HD-3086, DBW-187, DBW-222). "
            "2) Avoid excessive nitrogen fertilization. "
            "3) Chemical Control: Spray Propiconazole 25% EC (Tilt) @ 1 ml/L or Tebuconazole 25.9% EC @ 1 ml/L immediately upon symptom appearance."
        ),
    },
    {
        "id": "disease_tomato_blight",
        "category": "plant_pathology",
        "title": "Tomato Early Blight & Late Blight",
        "keywords": ["blight", "early blight", "late blight", "tomato spots", "alternaria", "phytophthora"],
        "content": (
            "Early Blight (Alternaria solani): Dark brown to black concentric circular rings ('target board' spots) on lower leaves with yellow halo. "
            "Late Blight (Phytophthora infestans): Water-soaked irregular dark brown lesions on leaves and stems with white fungal mold underneath in wet weather. "
            "Preventive Action: Prune lower leaves to enhance aeration, avoid overhead sprinkler irrigation, practice 3-year crop rotation. "
            "Bio-Control: Spray Trichoderma viride @ 5g/L or Bacillus subtilis @ 3g/L. "
            "Chemical Remedy: Early Blight: Spray Mancozeb 75% WP @ 2.5g/L or Azoxystrobin + Difenoconazole @ 1 ml/L. "
            "Late Blight: Spray Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5g/L or Cymoxanil + Mancozeb."
        ),
    },
    {
        "id": "pest_aphids_sucking",
        "category": "plant_pathology",
        "title": "Sucking Pests: Aphids, Jassids, Whiteflies & Thrips",
        "keywords": ["aphid", "jassid", "whitefly", "thrips", "sucking pest", "neem oil", "sooty mold"],
        "content": (
            "Symptoms: Leaf curling, crinkling, yellowing, and sticky honeydew secretion leading to black sooty mold growth. "
            "Vectors of devastating viral diseases like Leaf Curl Virus and Yellow Mosaic Virus. "
            "Integrated Management: "
            "1) Install Yellow Sticky Traps (for aphids/whiteflies) and Blue Sticky Traps (for thrips) @ 10-15 traps/acre. "
            "2) Bio-spray: 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 10,000 ppm @ 2-3 ml/L with soap solution. "
            "3) Chemical Spray: Thiamethoxam 25% WG @ 0.3g/L or Acetamiprid 20% SP @ 0.4g/L or Imidacloprid 17.8% SL @ 0.5 ml/L."
        ),
    },

    # -------------------------------------------------------------------------
    # 4. GOVERNMENT AGRICULTURE SCHEMES
    # -------------------------------------------------------------------------
    {
        "id": "scheme_pm_kisan",
        "category": "government_scheme",
        "title": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "keywords": ["pm-kisan", "pm kisan", "samman nidhi", "6000", "installment", "eligibility"],
        "content": (
            "Overview: Central sector scheme providing income support of ₹6,000 per year to all landholding farmer families. "
            "Payment Structure: Paid in three equal 4-monthly installments of ₹2,000 each directly via Direct Benefit Transfer (DBT). "
            "Eligibility: Landholding farmer families with cultivable land in their name. "
            "Mandatory Requirements: Aadhaar-linked active bank account, land ownership records (Khata/Khasra), and completed e-KYC (via OTP or biometric). "
            "Official Portal: pmkisan.gov.in or PM-KISAN mobile app."
        ),
    },
    {
        "id": "scheme_pmfby",
        "category": "government_scheme",
        "title": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        "keywords": ["pmfby", "crop insurance", "fasal bima", "claim", "drought", "flood insurance"],
        "content": (
            "Overview: Comprehensive crop insurance scheme offering financial support against non-preventable natural risks (drought, flood, unseasonal rain, pests). "
            "Farmer Premium Rates: 2.0% of Sum Insured for Kharif food/oilseed crops; 1.5% for Rabi crops; 5.0% for Annual Commercial/Horticultural crops. "
            "Remaining premium subsidized equally by Central & State Governments. "
            "Coverage: Prevented sowing, standing crop damage, post-harvest losses (up to 14 days for cyclone/unseasonal rains in yard), localized calamities (hailstorm/landslide). "
            "Claim Intimation: Intimate crop loss within 72 hours via Crop Insurance App or toll-free helpline 14447."
        ),
    },
    {
        "id": "scheme_kcc",
        "category": "government_scheme",
        "title": "Kisan Credit Card (KCC) Scheme",
        "keywords": ["kcc", "kisan credit card", "crop loan", "interest subvention", "loan"],
        "content": (
            "Overview: Provides timely and affordable short-term institutional credit for agricultural inputs, machinery maintenance, and post-harvest expenses. "
            "Interest Rate: Base rate 7% per annum for loans up to ₹3 Lakh. With 3% Prompt Repayment Incentive (PRI), the effective interest rate is only 4% per annum. "
            "Collateral-free Limit: No collateral required for loans up to ₹1.60 Lakh (or ₹3.0 Lakh with tie-up arrangements). "
            "Validity: 5 years with simple annual review and revolving cash credit facility. "
            "Application: Available at all Commercial Banks, Regional Rural Banks (RRBs), and Cooperative Banks."
        ),
    },
    {
        "id": "scheme_soil_health_card",
        "category": "government_scheme",
        "title": "Soil Health Card (SHC) Scheme",
        "keywords": ["soil health card", "shc", "soil test", "npk test", "soil nutrients"],
        "content": (
            "Overview: Promotes balanced and integrated nutrient management by providing farmers with customized soil test reports. "
            "Parameters Tested (12 indicators): Macro-nutrients (N, P, K), Secondary-nutrients (S), Micro-nutrients (Zn, Fe, Cu, Mn, Bo), "
            "and Physical properties (pH, Electrical Conductivity EC, Organic Carbon OC). "
            "Frequency: Issued every 3 years for farmer landholdings. "
            "Benefit: Prevents over-use of chemical fertilizers (especially Urea), reduces input costs by 15-20%, and optimizes crop yields."
        ),
    },
    {
        "id": "scheme_pmksy",
        "category": "government_scheme",
        "title": "PMKSY - Per Drop More Crop (Micro-Irrigation)",
        "keywords": ["pmksy", "drip irrigation", "sprinkler", "subsidy", "micro irrigation", "per drop more crop"],
        "content": (
            "Overview: Promotes water-use efficiency through micro-irrigation systems (Drip and Sprinkler irrigation). "
            "Subsidy Support: 55% financial assistance for Small & Marginal farmers; 45% financial assistance for Other farmers. "
            "Benefits: 40-50% water savings, 30-40% fertilizer savings through fertigation, and 20-35% crop productivity improvement. "
            "Application: State Department of Agriculture / Horticulture or online via state micro-irrigation portals."
        ),
    },
]
