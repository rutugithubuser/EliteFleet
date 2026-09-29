import { BriefcaseIcon, GlassIcon, PlaneIcon, UserIcon } from "../icons/Icons";
import Reveal from "../Reveal";
import SectionHeading from "./SectionHeading";
import styles from "./ChauffeurServices.module.css";

const ICONS = { user: UserIcon, plane: PlaneIcon, briefcase: BriefcaseIcon, event: GlassIcon };

export default function ChauffeurServices({ services }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal>
          <SectionHeading
            eyebrow="Our Chauffeur Services"
            title="Driven, Your Way."
            subtitle="Sit back in a premium car with a professional driver — wherever your day takes you."
            hideExtrasOnMobile
          />
        </Reveal>

        <Reveal stagger delay={0.1} className={styles.grid}>
          {services.map((service) => {
            const Icon = ICONS[service.icon] ?? UserIcon;
            return (
              <article className={styles.item} key={service._key}>
                <Icon className={styles.icon} aria-hidden="true" />
                <div className={styles.text}>
                  <h3 className={styles.itemTitle}>{service.title}</h3>
                  {service.description && <p className={styles.itemCopy}>{service.description}</p>}
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
