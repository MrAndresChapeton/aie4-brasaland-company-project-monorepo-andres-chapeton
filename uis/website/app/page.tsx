"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { citiesByCountry, locationsByCity, referralOptions, validateRegistration } from "../lib/registration";

const inputClass =
  "mt-2 w-full rounded-md border border-[#d9d0c4] bg-white/80 px-4 py-3 text-sm text-[#211d19] outline-none transition placeholder:text-[#746d64] focus:border-brasa focus:ring-2 focus:ring-brasa/15 disabled:cursor-not-allowed disabled:bg-[#ece7df]";

export default function Home() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function fieldProps(name: string) {
    return { id: name, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined };
  }

  function fieldError(name: string) {
    return errors[name] ? <span id={`${name}-error`} className="mt-2 block text-sm font-normal text-[#a42e16]">{errors[name]}</span> : null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validateRegistration(new FormData(form));
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      (form.elements.namedItem(firstError) as HTMLElement | null)?.focus();
      return;
    }
    setSubmitted(true);
    form.reset();
    setCountry("");
    setCity("");
  }

  return (
    <main id="contenido">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "Restaurant", name: "Brasaland",
        description: "Cadena de restaurantes de comida a la brasa en Colombia y Estados Unidos",
        url: "https://brasaland.com", foundingDate: "2008", servesCuisine: "Grilled food, Colombian cuisine", priceRange: "$$",
        address: [{ "@type": "PostalAddress", addressCountry: "CO", addressLocality: "Medellín", addressRegion: "Antioquia" }, { "@type": "PostalAddress", addressCountry: "US", addressLocality: "Miami", addressRegion: "FL" }],
        contactPoint: { "@type": "ContactPoint", telephone: "+57-4-123-4567", contactType: "customer service", availableLanguage: ["Spanish"] },
        sameAs: ["https://instagram.com/brasaland", "https://facebook.com/brasaland"],
      }) }} />
      <header className="relative z-10 border-b border-black/10 bg-[#f7f3ec]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8" aria-label="Navegación principal">
          <a className="flex items-center gap-3" href="#inicio" aria-label="Brasaland, inicio">
            <Image src="/brand-mark.png" alt="" width={42} height={42} priority className="h-10 w-10 object-contain" />
            <span className="display-font text-xl font-semibold">Brasaland</span>
          </a>
          <div className="hidden items-center gap-5 text-sm font-semibold text-[#574f46] lg:flex">
            <a className="transition hover:text-brasa" href="#inicio">Inicio</a>
            <a className="transition hover:text-brasa" href="#ubicaciones">Ubicaciones</a>
            <a className="transition hover:text-brasa" href="#menu">Menú</a>
            <a className="transition hover:text-brasa" href="#brasa-points">Brasa Points</a>
            <a className="transition hover:text-brasa" href="#contacto">Contacto</a>
          </div>
          <a className="rounded-md bg-brasa px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#993013]" href="#registro">
            Únete al programa
          </a>
        </nav>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-black/10 px-4 py-3 text-sm lg:hidden" aria-label="Navegación móvil">
          <a href="#inicio">Inicio</a><a href="#ubicaciones">Ubicaciones</a><a href="#menu">Menú</a><a href="#brasa-points">Brasa Points</a><a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section id="inicio" className="relative isolate min-h-[620px] overflow-hidden bg-[#241d18] text-white sm:min-h-[690px]">
        <div className="hero-photo absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#211a15]/90 via-[#211a15]/58 to-[#211a15]/10" />
        <div className="paper-grain pointer-events-none absolute inset-0 -z-10 opacity-20" />
        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:min-h-[690px] sm:px-8">
          <div className="max-w-3xl">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase text-[#f0c16a]">
              <span className="h-px w-9 bg-[#f0c16a]" />
              Medellín · Desde 2008
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              El sabor de la brasa, <span className="text-[#f0c16a]">en cada bocado</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Desde 2008 sirviendo las mejores carnes a la brasa en Colombia y Estados Unidos. 14 ubicaciones, una misma pasión por la calidad y el sabor.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <a href="/registro#registro" className="inline-flex items-center gap-3 rounded-md bg-brasa px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#993013]">
                Únete a Brasa Points <span aria-hidden="true">↗</span>
              </a>
              <a href="#brasa-points" className="text-sm font-semibold text-white underline decoration-white/45 underline-offset-4 transition hover:decoration-white">Descubre Brasa Points</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden w-[min(31vw,430px)] border-l border-t border-white/25 bg-[#211d19]/85 p-6 backdrop-blur-sm sm:block">
          <p className="display-font text-2xl">El fuego nos reúne.</p>
          <p className="mt-1 text-xs text-white/65">14 restaurantes · 2 países · 1 misma pasión</p>
        </div>
      </section>

      <section id="historia" className="border-b border-[#211d19]/10 bg-[#f7f3ec]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:items-center md:py-28">
          <div>
            <p className="text-xs font-bold uppercase text-brasa">Una historia a fuego lento</p>
            <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight sm:text-5xl">De un sueño familiar a tu mesa.</h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-[#574f46]">
              Fundada en Medellín en 2008, Brasaland comenzó como un sueño familiar: compartir el auténtico sabor de la carne a la brasa con calidad constante y servicio cálido. Hoy somos 14 restaurantes en dos países, pero mantenemos la misma receta de éxito: productos frescos, técnicas tradicionales, y pasión por cada plato que servimos.
            </p>
            <Image src="/grill.jpg" alt="Carnes a la brasa recién preparadas para compartir" width={900} height={600} className="mt-6 aspect-[3/2] w-full rounded-md object-cover" />
            <div className="mt-8 grid grid-cols-3 border-t border-[#211d19]/15 pt-5">
              <div><p className="display-font text-3xl text-brasa">14</p><p className="mt-1 text-xs text-[#746d64]">restaurantes</p></div>
              <div><p className="display-font text-3xl text-brasa">2</p><p className="mt-1 text-xs text-[#746d64]">países</p></div>
              <div><p className="display-font text-3xl text-brasa">2008</p><p className="mt-1 text-xs text-[#746d64]">año de fundación</p></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="valores" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 id="valores" className="text-3xl font-semibold">Lo que nos hace únicos</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <article><h3 className="text-2xl">Calidad Consistente</h3><p className="mt-3 leading-7 text-[#574f46]">Mismas recetas y estándares en todos los locales. Ingredientes frescos seleccionados diariamente.</p></article>
            <article><h3 className="text-2xl">Experiencia Cálida</h3><p className="mt-3 leading-7 text-[#574f46]">Servicio amable y atento. Ambiente familiar en cada visita.</p></article>
            <article><h3 className="text-2xl">Rapidez</h3><p className="mt-3 leading-7 text-[#574f46]">Tu comida lista en minutos. Sin sacrificar sabor ni calidad.</p></article>
          </div>
        </div>
      </section>

      <section id="ubicaciones" className="bg-[#211d19] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase text-[#f0c16a]">Siempre cerca</p>
              <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Ven a la brasa.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-white/65">14 restaurantes entre Colombia y Florida. Encuentra tu ciudad y comparte la mesa.</p>
          </div>
          <div className="mt-12 grid border-t border-white/20 md:grid-cols-2">
            <article className="border-b border-white/20 py-7 md:border-b-0 md:border-r md:pr-10">
              <p className="text-xs font-bold uppercase text-[#f0c16a]">10 restaurantes</p>
              <h3 className="mt-2 text-3xl">Colombia</h3>
              <p className="mt-3 text-sm text-white/70">Medellín · Bogotá · Cali</p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">{citiesByCountry.Colombia.map((name) => <li key={name}><strong>{name}:</strong> {locationsByCity[name].join(", ")}</li>)}</ul>
              <p className="mt-5 text-xs text-white/55">Todos los días · 11:00 a. m. – 10:00 p. m.</p>
            </article>
            <article className="py-7 md:pl-10">
              <p className="text-xs font-bold uppercase text-[#f0c16a]">4 restaurantes</p>
              <h3 className="mt-2 text-3xl">Florida, EE. UU.</h3>
              <p className="mt-3 text-sm text-white/70">Miami · Orlando</p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">{citiesByCountry["Estados Unidos"].map((name) => <li key={name}><strong>{name}:</strong> {locationsByCity[name].join(", ")}</li>)}</ul>
              <p className="mt-5 text-xs text-white/55">Todos los días · 11:00 a. m. – 10:00 p. m.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="menu" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 className="text-3xl font-semibold">Nuestro menú</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <article><h3 className="text-2xl">Picanha 250g</h3><p className="mt-3 text-[#574f46]">Nuestro corte a la brasa.</p></article>
            <article><h3 className="text-2xl">Papas fritas</h3><p className="mt-3 text-[#574f46]">El acompañamiento para compartir.</p></article>
            <article><h3 className="text-2xl">Bebidas</h3><p className="mt-3 text-[#574f46]">Refresca cada visita.</p></article>
          </div>
          <p className="mt-8 border-t border-black/10 pt-5 text-sm leading-7">¿Quieres hacer un pedido? Llama a tu ubicación favorita o visítanos directamente. ¡Pronto tendremos pedidos en línea!</p>
        </div>
      </section>

      <section id="brasa-points" className="relative overflow-hidden bg-[#c99a45] text-[#211d19]">
        <div className="paper-grain pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.9fr_1.1fr] md:items-center md:py-24">
          <div>
            <p className="text-xs font-bold uppercase">Un gusto que vuelve</p>
            <h2 className="mt-4 max-w-lg text-5xl font-semibold leading-[1.05]">Cada visita sabe mejor.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[#211d19]/75">Con Brasa Points, tus visitas se convierten en puntos para disfrutar descuentos, platos y beneficios exclusivos.</p>
            <a href="#registro" className="mt-8 inline-flex rounded-md bg-[#211d19] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#3b3128]">Quiero mis Brasa Points <span className="ml-3" aria-hidden="true">↓</span></a>
          </div>
          <ul className="divide-y divide-[#211d19]/20 border-y border-[#211d19]/20">
            <li className="flex gap-4 py-5"><span className="display-font text-xl">01</span><span className="text-sm font-semibold">Gana puntos con cada visita</span></li>
            <li className="flex gap-4 py-5"><span className="display-font text-xl">02</span><span className="text-sm font-semibold">Acumula 1 punto por cada $10.000 COP o $5 USD</span></li>
            <li className="flex gap-4 py-5"><span className="display-font text-xl">03</span><span className="text-sm font-semibold">Canjea puntos por descuentos y platos</span></li>
            <li className="flex gap-4 py-5"><span className="display-font text-xl">04</span><span className="text-sm font-semibold">Recibe ofertas exclusivas para miembros</span></li>
            <li className="flex gap-4 py-5"><span className="display-font text-xl">05</span><span className="text-sm font-semibold">Registro 100% digital. ¡Ya no más tarjetas de papel!</span></li>
          </ul>
        </div>
      </section>

      <section id="registro" className="bg-[#f7f3ec]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-[.72fr_1.28fr] md:py-28">
          <div className="md:sticky md:top-28 md:self-start">
            <p className="text-xs font-bold uppercase text-brasa">Tu próxima visita empieza aquí</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Únete a la mesa.</h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#746d64]">Crea tu cuenta Brasa Points y empieza a disfrutar beneficios en nuestros restaurantes.</p>
            <p className="mt-8 border-l-2 border-[#c99a45] pl-4 text-sm leading-6 text-[#746d64]">Registro gratuito. Debes tener al menos 18 años para participar.</p>
          </div>

          {submitted ? (
            <div className="self-center border-y border-[#211d19]/15 py-12" role="status" aria-live="polite">
              <p className="text-xs font-bold uppercase text-brasa">Registro completado</p>
              <h3 className="mt-4 text-4xl font-semibold">¡Bienvenido a Brasa Points!</h3>
              <p className="mt-4 max-w-lg leading-7 text-[#574f46]">Tu registro ha sido exitoso. Recibirás un email de confirmación en los próximos minutos con los detalles de tu cuenta y cómo empezar a acumular puntos.</p>
              <p className="mt-4 leading-7">¡Ya puedes disfrutar de tus beneficios en cualquiera de nuestras 14 ubicaciones!</p>
              <p className="mt-4 text-sm text-[#574f46]">Demostración: el envío es simulado; no se guardan datos ni se envían correos.</p>
              <button onClick={() => setSubmitted(false)} className="mt-7 text-sm font-bold text-brasa underline underline-offset-4">Registrar otra cuenta</button>
            </div>
          ) : (
            <form noValidate className="grid gap-x-5 gap-y-6 border-t border-[#211d19]/15 pt-7 sm:grid-cols-2" onSubmit={handleSubmit}>
              {Object.keys(errors).length > 0 && <p role="alert" className="text-sm text-[#a42e16] sm:col-span-2">Revisa los campos indicados para continuar.</p>}
              <label className="text-sm font-semibold sm:col-span-2">Nombre completo *
                <input {...fieldProps("fullName")} className={inputClass} name="fullName" type="text" autoComplete="name" placeholder="Ej. Ana Pérez" required />
                {fieldError("fullName")}
              </label>
              <label className="text-sm font-semibold">Correo electrónico *
                <input {...fieldProps("email")} className={inputClass} name="email" type="email" autoComplete="email" placeholder="nombre@correo.com" required />
                {fieldError("email")}
              </label>
              <label className="text-sm font-semibold">Teléfono con indicativo *
                <input {...fieldProps("phone")} className={inputClass} name="phone" type="tel" autoComplete="tel" placeholder={country === "Estados Unidos" ? "+1 305 123 4567" : "+57 300 123 4567"} required />
                {fieldError("phone")}
              </label>
              <label className="text-sm font-semibold">Fecha de nacimiento *
                <input {...fieldProps("birthDate")} className={inputClass} name="birthDate" type="date" autoComplete="bday" required />
                {fieldError("birthDate")}
              </label>
              <label className="text-sm font-semibold">País *
                <select {...fieldProps("country")} className={inputClass} name="country" value={country} onChange={(event) => { setCountry(event.target.value); setCity(""); }} required>
                  <option key="country-placeholder" value="">Selecciona tu país</option>
                  {Object.keys(citiesByCountry).map((option) => <option key={option}>{option}</option>)}
                </select>
                {fieldError("country")}
              </label>
              <label className="text-sm font-semibold">Ciudad *
                <select {...fieldProps("city")} className={inputClass} name="city" value={city} onChange={(event) => setCity(event.target.value)} disabled={!country} required>
                  <option key="city-placeholder" value="">Selecciona tu ciudad</option>
                  {(citiesByCountry[country] ?? []).map((option) => <option key={option}>{option}</option>)}
                </select>
                {fieldError("city")}
              </label>
              <label className="text-sm font-semibold">Brasaland favorito
                <select {...fieldProps("favoriteLocation")} key={`${country}-${city}`} className={inputClass} name="favoriteLocation" disabled={!city} defaultValue="">
                  <option key="location-placeholder" value="">Selecciona una sede</option>
                  {(locationsByCity[city] ?? []).map((location) => <option key={location} value={location}>Brasaland {location}</option>)}
                </select>
                {fieldError("favoriteLocation")}
              </label>
              <fieldset className="sm:col-span-2">
                <legend className="text-sm font-semibold">Preferencias alimentarias</legend>
                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                  {["Sin restricciones", "Vegetariano", "Sin gluten", "Otro"].map((preference) => (
                    <label className="flex items-center gap-2 text-sm text-[#574f46]" key={preference}>
                      <input className="h-4 w-4 accent-brasa" type="checkbox" name="foodPreferences" value={preference} />{preference}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="text-sm font-semibold sm:col-span-2">¿Cómo nos conociste? *
                <select {...fieldProps("referral")} className={inputClass} name="referral" required defaultValue="">
                  <option key="referral-placeholder" value="">Selecciona una opción</option>
                  {referralOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                {fieldError("referral")}
              </label>
              <div className="space-y-4 sm:col-span-2">
                <label className="flex items-start gap-3 text-sm leading-5 text-[#574f46]"><input {...fieldProps("terms")} className="mt-1 h-4 w-4 shrink-0 accent-brasa" name="terms" type="checkbox" required /><span>Acepto los términos del programa Brasa Points. *</span></label>
                {fieldError("terms")}
                <label className="flex items-start gap-3 text-sm leading-5 text-[#574f46]"><input className="mt-1 h-4 w-4 shrink-0 accent-brasa" name="offers" type="checkbox" /><span>Deseo recibir ofertas por correo electrónico.</span></label>
              </div>
              <div className="sm:col-span-2">
                <button className="w-full rounded-md bg-brasa px-6 py-4 text-sm font-bold text-white transition hover:bg-[#993013] sm:w-auto" type="submit">Crear mi cuenta <span className="ml-5" aria-hidden="true">→</span></button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section id="contacto" className="border-t border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <h2 className="text-3xl font-semibold">Contacto</h2>
          <div className="mt-6 flex flex-wrap gap-6 text-sm"><a href="mailto:hola@brasaland.com">hola@brasaland.com</a><a href="tel:+5741234567">Colombia: +57 4 123 4567</a><a href="tel:+13051234567">Florida: +1 305 123 4567</a></div>
        </div>
      </section>
      <footer className="bg-[#211d19] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm sm:px-8 md:flex-row md:items-center md:justify-between">
          <a href="#inicio" className="display-font text-xl">Brasaland</a>
          <p className="text-white/65">Medellín, Colombia · Miami, Florida · hola@brasaland.com</p>
          <div className="flex flex-wrap gap-4"><a href="https://instagram.com/brasaland">Instagram</a><a href="https://facebook.com/brasaland">Facebook</a></div>
          <p className="text-xs text-white/65">© 2025 Brasaland. Todos los derechos reservados.</p>
        </div>
      </footer>
    </main>
  );
}