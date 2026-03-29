import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const reverts = {
    // message center
    'useTìm kiếmParams': 'useSearchParams',
    'HiOutlineTìm kiếm': 'HiOutlineSearch',
    'setTìm kiếmKeyword': 'setSearchKeyword',
    'setTin nhắn': 'setMessages',
    'loadingTin nhắn': 'loadingMessages',
    'getCaseTrạng tháiMeta': 'getCaseStatusMeta',

    // client dossiers
    'HiTìm kiếm': 'HiSearch',
    'setTìm kiếmQuery': 'setSearchQuery',
};

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            for (const [key, value] of Object.entries(reverts)) {
                if (content.includes(key)) {
                    content = content.split(key).join(value);
                }
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Reverted safely: ${fullPath.substring(srcDir.length)}`);
            }
        }
    }
}

console.log('Starting javascript identifier revert...');
processDirectory(srcDir);
console.log('Done.');
