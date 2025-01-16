import React from "react";

export default function Footer() {
  return (
    <footer class="bg-dark pt-10 pb-8">
      <div className="container">
        {/* <div class="container">
          <div class="border-bottom border-white-10 pb-7">
            <div class="col-12 col-md-8 col-lg-6 d-flex mx-auto flex-column align-items-center justify-content-center">
              <h2 class="fs-1 fw-bolder text-white text-center">
                Besoin d'une solution sur mesure ?
              </h2>
              <a
                class="btn btn-primary mt-3 w-100 w-md-auto"
                href="#"
                role="button"
              >
                Contactez-Nous
              </a>
            </div>
          </div>
        </div> */}
        <div class="container pt-7">
          <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-center">
            <a
              class="d-flex align-items-center lh-1 text-white transition-opacity opacity-50-hover text-decoration-none mb-4 mb-md-0"
              href="#"
            >
              <img
                className="w-50 h-50"
                src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                alt=""
              />
            </a>
            <ul class="list-unstyled d-flex align-items-center justify-content-end">
              <li class="ms-5">
                <a
                  class="text-white text-decoration-none opacity-50-hover transition-opacity"
                  href="#"
                >
                  <i class="ri-facebook-circle-line ri-lg"></i>
                </a>
              </li>
              <li class="ms-5">
                <a
                  class="text-white text-decoration-none opacity-50-hover transition-opacity"
                  href="#"
                >
                  <i class="ri-twitter-line ri-lg"></i>
                </a>
              </li>
              <li class="ms-5">
                <a
                  class="text-white text-decoration-none opacity-50-hover transition-opacity"
                  href="#"
                >
                  <i class="ri-instagram-line ri-lg"></i>
                </a>
              </li>
              <li class="ms-5">
                <a
                  class="text-white text-decoration-none opacity-50-hover transition-opacity"
                  href="#"
                >
                  <i class="ri-snapchat-line ri-lg"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="container">
          <div class="d-flex flex-wrap justify-content-between mt-5 mt-lg-7">
            <div class="w-100 w-sm-50 w-lg-auto mb-4 mb-lg-0">
              <h6 class="footer-heading">Departements</h6>
              <ul class="footer-nav list-unstyled">
                <li>
                  <a href="#">
                    Fatihoune <span class="text-success">Learn</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Fatihoune <span class="text-success">Santé</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Fatihoune <span class="text-success">Dev's</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Fatihoune <span class="text-success">Foods</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Fatihoune <span class="text-success">Distribution</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Fatihoune <span class="text-success">Immo</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Fatihoune <span class="text-success">Agric</span>
                  </a>
                </li>
                <li>
                  <a href="#">
                    Fatihoune <span class="text-success">Import & Export</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="w-100 w-sm-50 w-lg-auto mb-4 mb-lg-0">
              <h6 class="footer-heading">Fatihoune S.A.R.L</h6>
              <ul class="footer-nav list-unstyled">
                <li>
                  <a href="#">Apropos de nous</a>
                </li>
                <li>
                  <a href="#">Nos valeurs</a>
                </li>
                <li>
                  <a href="#">Rejoignez notre équipe</a>
                </li>
                <li>
                  <a href="#">Devenir partenaire</a>
                </li>
              </ul>
            </div>
            <div class="w-100 w-sm-50 w-lg-auto mb-4 mb-lg-0">
              <h6 class="footer-heading">Navigation</h6>
              <ul class="footer-nav list-unstyled">
                <li>
                  <a href="#">Aide et support</a>
                </li>
                <li>
                  <a href="#">Contactez-Nous</a>
                </li>
              </ul>
            </div>
            <div class="w-100 w-sm-50 w-lg-auto mb-4 mb-lg-0">
              <h6 class="footer-heading">Mentions légales</h6>
              <ul class="footer-nav list-unstyled">
                <li>
                  <a href="#">Politique de confidentialité</a>
                </li>
                <li>
                  <a href="#">Termes et conditions</a>
                </li>
                <li>
                  <a href="#">Politique de cookies</a>
                </li>
                <li>
                  <a href="#">Mentions légales de l'entreprise</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="border-top pt-6 mt-7 border-white-10 d-flex flex-column flex-md-row justify-content-between align-items-center">
            <span class="small text-white opacity-50 mb-2 mb-md-0">
              Tous droits réservés 2023
            </span>
            <span class="small text-white opacity-50">
              Conditions d'utilisation | Politique de sécurité
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
