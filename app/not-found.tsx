import Link from "next/link";

export default function NotFound() {
  return (
    <main className="status-page">
      <section className="status-panel">
        <p className="eyebrow">NOT FOUND</p>
        <h1>This reflection isn’t here.</h1>
        <p>
          The link may be incomplete or the result may no longer be available.
        </p>
        <Link className="button button-primary" href="/">
          Return home <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
