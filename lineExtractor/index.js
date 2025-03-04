// modules
import { writeFile, readFile } from 'fs/promises';
import { stringify } from 'csv-stringify/sync'; // csv stringify
import iconv from 'iconv-lite'; // encoding

// fixed string
const fixedString = 'ebisudo';

// header
const sheetTitleArray = [
    ['userid', 'name', 'nickname']
];

(async() => {
    let profileArray = [];
    const json = JSON.parse(await readFile(`./json/${fixedString}.json`));
    json.forEach(val => {
        val.list.forEach(user => {
            if (user.profile.userId) {
                const profile = [user.profile.userId, user.profile.name, user.profile.nickname];
                profileArray.push(profile);
            } 
        });
    });
    // csvdata
    const csvData = stringify(profileArray, { header: false });
    // write to csv file
    await writeFile(`${fixedString}.csv`, iconv.encode(csvData, 'shift_jis'));
})();