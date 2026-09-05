import requests
import pandas as pd
import time
from tqdm import tqdm

# ============================================================
# SETTINGS
# ============================================================

START_DATE = "20050101"
END_DATE = "20251231"

PARAMETERS = [
    "T2M",           # Average temperature
    "T2M_MAX",       # Maximum temperature
    "T2M_MIN",       # Minimum temperature
    "RH2M",          # Relative humidity
    "PRECTOTCORR",   # Precipitation
    "WS10M",         # Wind speed
    "PS"             # Surface pressure
]

DISTRICTS = {

    # =========================================================
    # MAHARASHTRA - 36
    # =========================================================

    "Maharashtra_Ahmednagar": (19.0948, 74.7480),
    "Maharashtra_Akola": (20.7002, 77.0082),
    "Maharashtra_Amravati": (20.9374, 77.7796),
    "Maharashtra_Aurangabad": (19.8762, 75.3433),
    "Maharashtra_Beed": (18.9891, 75.7601),
    "Maharashtra_Bhandara": (21.1700, 79.6500),
    "Maharashtra_Buldhana": (20.5293, 76.1842),
    "Maharashtra_Chandrapur": (19.9700, 79.3000),
    "Maharashtra_Dhule": (20.9042, 74.7749),
    "Maharashtra_Gadchiroli": (20.1809, 79.9947),
    "Maharashtra_Gondia": (21.4600, 80.1900),
    "Maharashtra_Hingoli": (19.7200, 77.1500),
    "Maharashtra_Jalgaon": (21.0077, 75.5626),
    "Maharashtra_Jalna": (19.8347, 75.8816),
    "Maharashtra_Kolhapur": (16.7050, 74.2433),
    "Maharashtra_Latur": (18.4088, 76.5604),
    "Maharashtra_Mumbai": (19.0760, 72.8777),
    "Maharashtra_Nagpur": (21.1458, 79.0882),
    "Maharashtra_Nanded": (19.1383, 77.3210),
    "Maharashtra_Nandurbar": (21.3667, 74.2333),
    "Maharashtra_Nashik": (20.0059, 73.7897),
    "Maharashtra_Osmanabad": (18.1860, 76.0419),
    "Maharashtra_Palghar": (19.6967, 72.7653),
    "Maharashtra_Parbhani": (19.2600, 76.7800),
    "Maharashtra_Pune": (18.5204, 73.8567),
    "Maharashtra_Raigad": (18.6414, 72.8722),
    "Maharashtra_Ratnagiri": (16.9902, 73.3120),
    "Maharashtra_Sangli": (16.8524, 74.5815),
    "Maharashtra_Satara": (17.6805, 74.0183),
    "Maharashtra_Sindhudurg": (16.3492, 73.5594),
    "Maharashtra_Solapur": (17.6599, 75.9064),
    "Maharashtra_Thane": (19.2183, 72.9781),
    "Maharashtra_Wardha": (20.7453, 78.6022),
    "Maharashtra_Washim": (20.1113, 77.1310),
    "Maharashtra_Yavatmal": (20.3899, 78.1307),

    # =========================================================
    # GUJARAT - 12
    # =========================================================

    "Gujarat_Ahmedabad": (23.0225, 72.5714),
    "Gujarat_Rajkot": (22.3039, 70.8022),
    "Gujarat_Surat": (21.1702, 72.8311),
    "Gujarat_Vadodara": (22.3072, 73.1812),
    "Gujarat_Bhavnagar": (21.7645, 72.1519),
    "Gujarat_Jamnagar": (22.4707, 70.0577),
    "Gujarat_Bhuj": (23.2420, 69.6669),
    "Gujarat_Mehasana": (23.5880, 72.3693),
    "Gujarat_Anand": (22.5645, 72.9289),
    "Gujarat_Bharuch": (21.7051, 72.9959),
    "Gujarat_Patan": (23.8493, 72.1266),
    "Gujarat_Gandhinagar": (23.2156, 72.6369),

    # =========================================================
    # MADHYA PRADESH - 12
    # =========================================================

    "MP_Bhopal": (23.2599, 77.4126),
    "MP_Indore": (22.7196, 75.8577),
    "MP_Jabalpur": (23.1815, 79.9864),
    "MP_Gwalior": (26.2183, 78.1828),
    "MP_Ujjain": (23.1765, 75.7885),
    "MP_Sagar": (23.8388, 78.7378),
    "MP_Rewa": (24.5373, 81.2961),
    "MP_Satna": (24.6005, 80.8322),
    "MP_Ratlam": (23.3315, 75.0367),
    "MP_Khandwa": (21.8247, 76.3500),
    "MP_Burhanpur": (21.3000, 76.2300),
    "MP_Chhindwara": (22.0574, 78.9382),

    # =========================================================
    # KARNATAKA - 12
    # =========================================================

    "Karnataka_Bengaluru": (12.9716, 77.5946),
    "Karnataka_Mysuru": (12.2958, 76.6394),
    "Karnataka_Mangaluru": (12.9141, 74.8560),
    "Karnataka_Hubballi": (15.3647, 75.1240),
    "Karnataka_Belagavi": (15.8497, 74.4977),
    "Karnataka_Kalaburagi": (17.3297, 76.8343),
    "Karnataka_Ballari": (15.1394, 76.9214),
    "Karnataka_Shivamogga": (13.9299, 75.5681),
    "Karnataka_Tumakuru": (13.3392, 77.1010),
    "Karnataka_Davangere": (14.4644, 75.9218),
    "Karnataka_Raichur": (16.2120, 77.3439),
    "Karnataka_Vijayapura": (16.8302, 75.7100),

    # =========================================================
    # RAJASTHAN - 12
    # =========================================================

    "Rajasthan_Jaipur": (26.9124, 75.7873),
    "Rajasthan_Jodhpur": (26.2389, 73.0243),
    "Rajasthan_Udaipur": (24.5854, 73.7125),
    "Rajasthan_Kota": (25.2138, 75.8648),
    "Rajasthan_Ajmer": (26.4499, 74.6399),
    "Rajasthan_Bikaner": (28.0229, 73.3119),
    "Rajasthan_Alwar": (27.5530, 76.6346),
    "Rajasthan_Bharatpur": (27.2152, 77.5030),
    "Rajasthan_Sikar": (27.6094, 75.1399),
    "Rajasthan_Bhilwara": (25.3407, 74.6313),
    "Rajasthan_Barmer": (25.7538, 71.3883),
    "Rajasthan_Chittorgarh": (24.8887, 74.6269),

    # =========================================================
    # UTTAR PRADESH - 15
    # =========================================================

    "UP_Lucknow": (26.8467, 80.9462),
    "UP_Kanpur": (26.4499, 80.3319),
    "UP_Varanasi": (25.3176, 82.9739),
    "UP_Agra": (27.1767, 78.0081),
    "UP_Meerut": (28.9845, 77.7064),
    "UP_Prayagraj": (25.4358, 81.8463),
    "UP_Gorakhpur": (26.7606, 83.3732),
    "UP_Bareilly": (28.3670, 79.4304),
    "UP_Moradabad": (28.8386, 78.7733),
    "UP_Jhansi": (25.4484, 78.5685),
    "UP_Azamgarh": (26.0736, 83.1850),
    "UP_Bulandshahr": (28.4069, 77.8498),
    "UP_Mathura": (27.4924, 77.6737),
    "UP_Saharanpur": (29.9680, 77.5552),
    "UP_Banda": (25.4753, 80.3398),
}

# ============================================================
# NASA POWER API
# ============================================================

BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

all_data = []

for district, (latitude, longitude) in tqdm(
    DISTRICTS.items(),
    desc="Downloading districts"
):

    params = {
        "parameters": ",".join(PARAMETERS),
        "community": "AG",
        "longitude": longitude,
        "latitude": latitude,
        "start": START_DATE,
        "end": END_DATE,
        "format": "JSON"
    }

    try:
        response = requests.get(
            BASE_URL,
            params=params,
            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        properties = data["properties"]
        parameter_data = properties["parameter"]

        # Convert NASA date dictionary into rows
        rows = []

        dates = list(parameter_data["T2M"].keys())

        for date in dates:

            row = {
                "date": pd.to_datetime(date, format="%Y%m%d"),
                "district": district,
                "latitude": latitude,
                "longitude": longitude,
            }

            for parameter in PARAMETERS:
                row[parameter] = parameter_data[parameter].get(date)

            rows.append(row)

        district_df = pd.DataFrame(rows)

        all_data.append(district_df)

        print(
            f"Downloaded {district}: "
            f"{len(district_df)} records"
        )

        # Avoid sending requests too quickly
        time.sleep(1)

    except Exception as e:

        print(
            f"\nERROR downloading {district}: {e}"
        )


# ============================================================
# COMBINE EVERYTHING
# ============================================================

if all_data:

    final_df = pd.concat(
        all_data,
        ignore_index=True
    )

    # Replace NASA missing value
    final_df.replace(
        [-999, -999.0],
        pd.NA,
        inplace=True
    )

    # Sort
    final_df.sort_values(
        ["district", "date"],
        inplace=True
    )

    # Save
    output_file = "maharashtra_weather_dataset.csv"

    final_df.to_csv(
        output_file,
        index=False
    )

    print("\n====================================")
    print("DOWNLOAD COMPLETED")
    print("====================================")
    print(f"File: {output_file}")
    print(f"Rows: {len(final_df):,}")
    print(f"Columns: {len(final_df.columns)}")
    print(f"Districts: {final_df['district'].nunique()}")

else:

    print("No data downloaded.")