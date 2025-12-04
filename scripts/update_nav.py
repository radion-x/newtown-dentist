import os
import re

def update_nav():
    root_dir = 'public'
    
    new_nav_html = """<ul class="dropdown-menu">
                            <li class="dropdown-submenu">
                                <a href="/treatments/general-dentistry">General Dentistry</a>
                                <ul class="dropdown-menu">
                                    <li><a href="/treatments/oral-health-assessment">Checkups & Cleans</a></li>
                                    <li><a href="/treatments/tooth-coloured-fillings">Fillings</a></li>
                                    <li><a href="/treatments/wisdom-teeth">Wisdom Teeth</a></li>
                                    <li><a href="/treatments/root-canal">Root Canal</a></li>
                                    <li><a href="/treatments/childrens-dentistry">Children's Dentistry</a></li>
                                    <li><a href="/treatments/extractions">Extractions</a></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu">
                                <a href="/treatments/cosmetic-dentistry">Cosmetic Dentistry</a>
                                <ul class="dropdown-menu">
                                    <li><a href="/treatments/teeth-whitening">Teeth Whitening</a></li>
                                    <li><a href="/treatments/porcelain-veneers">Porcelain Veneers</a></li>
                                    <li><a href="/treatments/smile-makeovers">Smile Makeovers</a></li>
                                    <li><a href="/treatments/inlays-onlays">Inlays & Onlays</a></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu">
                                <a href="/treatments/restorative-dentistry">Restorative Dentistry</a>
                                <ul class="dropdown-menu">
                                    <li><a href="/treatments/dental-implants">Dental Implants</a></li>
                                    <li><a href="/treatments/dental-crowns">Dental Crowns</a></li>
                                    <li><a href="/treatments/dental-bridges">Dental Bridges</a></li>
                                    <li><a href="/treatments/dentures">Dentures</a></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu">
                                <a href="/treatments/preventative-care">Preventative Care</a>
                                <ul class="dropdown-menu">
                                    <li><a href="/treatments/oral-hygiene">Oral Hygiene</a></li>
                                    <li><a href="/treatments/gum-disease">Gum Disease</a></li>
                                    <li><a href="/treatments/mouthguards">Mouthguards</a></li>
                                    <li><a href="/treatments/night-guards">Night Guards</a></li>
                                </ul>
                            </li>
                        </ul>"""

    # Regex to match the old dropdown menu. 
    # It looks for <ul class="dropdown-menu"> followed by the 3 specific links, handling potential 'active' classes and whitespace.
    regex_pattern = re.compile(
        r'<ul class="dropdown-menu">\s*'
        r'<li><a href="/treatments/general-dentistry"[^>]*>General Dentistry</a></li>\s*'
        r'<li><a href="/treatments/cosmetic-dentistry"[^>]*>Cosmetic Dentistry</a></li>\s*'
        r'<li><a href="/treatments/preventative-care"[^>]*>Preventative Care</a></li>\s*'
        r'</ul>',
        re.DOTALL
    )

    count = 0
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.html'):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = regex_pattern.sub(new_nav_html, content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
                    count += 1
                else:
                    print(f"No match found in {filepath}")

    print(f"Total files updated: {count}")

if __name__ == "__main__":
    update_nav()
