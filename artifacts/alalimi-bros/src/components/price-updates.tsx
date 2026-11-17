const pricingAsset = (fileName: string) =>
  `${import.meta.env.BASE_URL}pricing/${fileName}`;

const priceUpdates = [
  {
    name: 'سم بريك',
    productImage: 'brake-fluid.webp',
    logoImage: 'abro-logo.png',
    logoAlt: 'شعار ABRO',
    previousPrice: 'السعر السابق 1 ر.س',
    newPrice: 'السعد الجديد 1.5 ر.س',
  },
  {
    name: 'رنجات كرولا 1300',
    productImage: 'corolla-rings.jpeg',
    logoImage: 'tpr-logo.png',
    logoAlt: 'شعار TPR',
    previousPrice: 'السعر القديم 50',
    newPrice: 'الجديد 54',
  },
  {
    name: 'مرتزي امامي كرولا 2005 يمين',
    productImage: 'corolla-front-strut.jpeg',
    logoImage: 'star-msk-logo.png',
    logoAlt: 'شعار STAR-MSK النجم',
    previousPrice: 'السعر القديم 45',
    newPrice: 'الجديد 48',
  },
  {
    name: 'بطارية',
    productImage: 'leader-battery.jpeg',
    logoImage: 'leader-logo.png',
    logoAlt: 'شعار LEADER',
    previousPrice: 'السعر القديم 230',
    newPrice: 'الجديد 240',
  },
];

export default function PriceUpdates() {
  return (
    <div className="price-updates-grid" aria-label="تحديثات الأسعار">
      {priceUpdates.map((product) => (
        <article className="price-update-card" key={product.name}>
          <h2 className="price-update-name">{product.name}</h2>

          <div className="price-update-photo">
            <img
              src={pricingAsset(product.productImage)}
              alt={product.name}
              loading="lazy"
            />
          </div>

          <img
            className="price-update-logo"
            src={pricingAsset(product.logoImage)}
            alt={product.logoAlt}
            loading="lazy"
          />

          <div className="price-update-prices">
            <div className="price-update-previous">
              <span className="price-update-x" aria-hidden="true">×</span>
              <s>{product.previousPrice}</s>
            </div>
            <strong className="price-update-new">{product.newPrice}</strong>
          </div>
        </article>
      ))}
    </div>
  );
}
