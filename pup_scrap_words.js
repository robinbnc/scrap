const puppeteer = require('puppeteer');
const fs = require('fs')

function	get_comb_array()
{
	let alphabet = "abcdefghijklmnopqrstuvwxyzéèêï";
	let char_comb = [];
	
	for (let i = 0; i < alphabet.length; i++)
	{
		for (let j = 0; j < alphabet.length; j++)
		{
			for (let k = 0; k < alphabet.length; k++)
			{
				char_comb.push(alphabet[i] + alphabet[j] + alphabet[k]);
				if (k == alphabet.length - 1)
				{
					fs.writeFile('./log.txt',
						"first char: " + i.toString() + " second char: " + j.toString() + " third char: " + k.toString(k) + "\n",
						err => {
						if (err) {
							console.error(err)
							return
						}
					})
				}
			}
		}
	}
	return (char_comb);
}

function	push_array_to_csv(array)
{
	for (let i = 0; i < array.length; i++)
	{
		fs.appendFile('./keywords_MCF.csv', array[i] + "\n", err => {
			if (err) {
				console.error(err)
				return
			}
		})
	}
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

(async () => {
	let array = get_comb_array();
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();
	await page.goto('https://www.moncompteformation.gouv.fr/espace-prive/html/#/formation/recherche');
	await sleep(1000);
	await page.click("#cdk-overlay-0 > mat-bottom-sheet-container > mcf-cm-banner > div.mcf-bottom-sheet-actions > button:nth-child(1)");
	await sleep(1000);
	for (let i = 0; i < array.length; i++)
	{
		await page.evaluate( () => document.querySelector("#mat-input-0").value = "")
		await page.type("#mat-input-0", array[i]);
		await sleep(800);
		await page.waitForSelector('#mat-autocomplete-0');
		let list_of_keywords = await page.evaluate(() => {
			let data = [];
			let elements = document.getElementsByClassName('mat-option mat-focus-indicator ng-star-inserted');
			for (var element of elements)
			data.push(element.textContent);
			return (data);
		});
		await push_array_to_csv(list_of_keywords);
	}
	await browser.close();
})();