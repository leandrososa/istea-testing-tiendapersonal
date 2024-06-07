import { test, expect, type Page, type ElementHandle } from '@playwright/test';

/*
  Descripcion: Se va a comprar el Edge 40 más barato en tienda.personal.com.ar
  Resultado esperado: Que el producto incluya accesorios, que se pueda pagar
  en 6 cuotas sin interes, y que al presionar comprar se redirija al formulario
  de datos personales.

  Pasos a seguir:
          
  - Ingrese a https://tienda.personal.com.ar/
  - Busque el Edge 40
  - Ordenar por más barato
  - Verificar que el más barato tenga el texto 'Incluye accesorios'
  - Verificar que además se pueda pagar en 6 cuotas sin interes
  - Presionar comprar y verificar que redirige al formulario de datos personales.
 */

test.beforeEach(async ({ page }) => {
  // Navegar a Tienda Personal
  await page.goto('https://tienda.personal.com.ar/');
});

test.describe('TiendaPersonal || Edge 40 mas barato', () => {
  let productItem: ElementHandle<HTMLElement | SVGElement> | null = null;
  let productItemText: string | null = null;

  test.beforeEach(async ({ page }) => {
    // Búsqueda
    await page.fill('form > i.fa-search + input[type="text"]', 'Edge 40');
    await page.press('form > i.fa-search + input[type="text"]', 'Enter');

    // Ordenamiento
    await page.click('span:has-text("Ordenar por:") + div');
    await page.click('a[href$="Menor+precio"]');

    productItem = await page.waitForSelector('a[isshoplanding="false"]');
    productItemText = await productItem.textContent();
  });

  test('El modelo mas barato incluye accesorios', async ({ page }) => {
    expect(productItemText).toContain('Incluye accesorios');

  });

  test('El modelo mas barato tiene 6 cuotas sin interés', async ({ page }) => {
    expect(productItemText).toContain('6');
    expect(productItemText).toContain('cuotas');
    expect(productItemText).toContain('sin interés');
  });

  test('El modelo redirige a pagina de ingreso de datos personales', async ({ page }) => {
    await productItem?.click();
    await page.click('a.emsye84h');
    await page.waitForURL('**/personal-data');
    await expect(page.url()).toContain('/personal-data');
  });
});

test.describe('TiendaPersonal || Verificar cambio de color', () => {

  test.beforeEach(async ({ page }) => {
    // Ingresar a celulares
    await page.click('a[title="Celulares"]');
    // Filtrar por Apple
    await page.click('a[href$="apple"]');
    // Seleccionar el iPhone 13 256 GB
    await page.click('a:has-text("iPhone 13 256 GB")');
    // Seleccionar el color rojo
    await page.click('div[style$="background-color: rgb(214, 16, 16)"]');
  });

  test('Verificar cambio de color', async ({ page }) => {
    

    // Verificar cambie el atributo de color por 'red'
    const colorAttribute = await page.getAttribute('div:has-text("Rojo")', 'data-color');
    expect(colorAttribute).toBe('red');

    // Verificar que agregue la etiqueta 'red' al dom
    const colorElement = await page.$('div:has-text("Rojo")');
    expect(colorElement).not.toBeNull();

    // Presionar comprar y verificar que la url destino almacene el color en el URI
    await page.click('button:has-text("Comprar")');
    await page.waitForURL('**red**');
    await expect(page.url()).toContain('/red');
  });
})