import subprocess
import time

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
urls_and_files = [
    ("http://127.0.0.1:8099/#home", "screenshots/01_home.png", "1280,800"),
    ("http://127.0.0.1:8099/#explore", "screenshots/02_explore.png", "1280,800"),
    ("http://127.0.0.1:8099/#explore?modal=college", "screenshots/02b_college_discovery.png", "1280,800"),
    ("http://127.0.0.1:8099/#attic", "screenshots/03_memory_attic.png", "1280,800"),
    ("http://127.0.0.1:8099/#attic?modal=letter", "screenshots/03b_attic_parchment_letter.png", "1280,800"),
    ("http://127.0.0.1:8099/#wish", "screenshots/04_make_a_wish.png", "1280,800"),
    ("http://127.0.0.1:8099/#story", "screenshots/05_storybook_shelf.png", "1280,800"),
    ("http://127.0.0.1:8099/#story?story=reader", "screenshots/05b_storybook_reader.png", "1280,800"),
    ("http://127.0.0.1:8099/#secret", "screenshots/06_secret_room.png", "1280,800"),
    ("http://127.0.0.1:8099/#explore", "screenshots/02_explore_mobile.png", "390,844"),
]

for url, out_file, win_size in urls_and_files:
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--virtual-time-budget=2000",
        f"--window-size={win_size}",
        f"--screenshot={out_file}",
        url
    ]
    print(f"Capturing {out_file}...")
    subprocess.run(cmd, check=True)

print("All screenshots captured with virtual time budget!")
