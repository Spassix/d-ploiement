// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Highlight de la section active dans la navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Sauvegarder l'état des checkboxes dans le localStorage
const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    // Charger l'état sauvegardé
    const savedState = localStorage.getItem(`checkbox-${checkbox.closest('label').textContent.trim()}`);
    if (savedState === 'true') {
        checkbox.checked = true;
    }

    // Sauvegarder l'état lors du changement
    checkbox.addEventListener('change', () => {
        localStorage.setItem(`checkbox-${checkbox.closest('label').textContent.trim()}`, checkbox.checked);
    });
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les sections
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Bouton "Retour en haut" (optionnel, peut être ajouté si nécessaire)
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
        } else {
            button.style.opacity = '0';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

createBackToTopButton();

// Améliorer l'accessibilité du clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Fermer tout menu ou modal ouvert si nécessaire
    }
});

// Copier le code dans les blocs de code (fonctionnalité bonus)
document.querySelectorAll('.code-block').forEach(block => {
    const copyButton = document.createElement('button');
    copyButton.innerHTML = '📋 Copier';
    copyButton.className = 'copy-code-btn';
    copyButton.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        color: var(--code-text);
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-size: 0.85rem;
        transition: background 0.2s;
        z-index: 10;
    `;
    
    copyButton.addEventListener('mouseenter', () => {
        copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    copyButton.addEventListener('mouseleave', () => {
        copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
    });

    copyButton.addEventListener('click', () => {
        // Copier le code avec les valeurs remplacées (pas les placeholders)
        const code = block.querySelector('code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            copyButton.innerHTML = '✅ Copié!';
            setTimeout(() => {
                copyButton.innerHTML = '📋 Copier';
            }, 2000);
        }).catch(err => {
            console.error('Erreur lors de la copie:', err);
            copyButton.innerHTML = '❌ Erreur';
            setTimeout(() => {
                copyButton.innerHTML = '📋 Copier';
            }, 2000);
        });
    });

    block.style.position = 'relative';
    block.appendChild(copyButton);
});

// ============================================
// GESTION DES VARIABLES DYNAMIQUES
// ============================================

// Mapping des IDs de champs vers les variables
const variableMap = {
    'vps-ip': 'VPS_IP',
    'nom-boutique': 'NOM_BOUTIQUE',
    'sous-domaine': 'SOUS_DOMAINE',
    'chemin-projet': 'CHEMIN_PROJET',
    'supabase-url': 'SUPABASE_URL',
    'supabase-anon-key': 'SUPABASE_ANON_KEY',
    'supabase-service-key': 'SUPABASE_SERVICE_KEY',
    'repo-git': 'REPO_GIT',
    'vps-password': 'VPS_PASSWORD'
};

// Valeurs par défaut
const defaultValues = {
    'VPS_IP': '157.180.44.114',
    'NOM_BOUTIQUE': 'NOM_BOUTIQUE',
    'SOUS_DOMAINE': 'SOUS_DOMAINE',
    'CHEMIN_PROJET': '/chemin/vers/votre/boutique',
    'SUPABASE_URL': 'https://VOTRE-PROJET.supabase.co',
    'SUPABASE_ANON_KEY': 'VOTRE_CLE_ANON_ICI',
    'SUPABASE_SERVICE_KEY': 'VOTRE_CLE_SERVICE_ICI',
    'REPO_GIT': 'https://votre-repo.git',
    'VPS_PASSWORD': ''
};

// Obtenir les valeurs actuelles depuis les champs
function getCurrentValues() {
    const values = {};
    Object.keys(variableMap).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const varName = variableMap[fieldId];
            values[varName] = field.value || defaultValues[varName];
        }
    });
    return values;
}

// Mettre à jour tous les blocs de code
function updateCodeBlocks() {
    const values = getCurrentValues();
    
    // Mettre à jour les blocs de code avec data-code
    document.querySelectorAll('.code-block[data-code]').forEach(block => {
        const codeElement = block.querySelector('code');
        if (codeElement) {
            let code = codeElement.getAttribute('data-original') || codeElement.textContent;
            
            // Sauvegarder le code original la première fois
            if (!codeElement.getAttribute('data-original')) {
                codeElement.setAttribute('data-original', code);
            } else {
                code = codeElement.getAttribute('data-original');
            }
            
            // Remplacer toutes les variables
            Object.keys(values).forEach(varName => {
                const regex = new RegExp(`\\{\\{${varName}\\}\\}`, 'g');
                code = code.replace(regex, values[varName]);
            });
            
            codeElement.textContent = code;
        }
    });
    
    // Mettre à jour les valeurs dynamiques dans le texte
    document.querySelectorAll('.dynamic-value').forEach(element => {
        const varName = element.getAttribute('data-var');
        if (varName && values[varName]) {
            element.textContent = values[varName];
        }
    });
}

// Écouter les changements dans tous les champs de configuration
Object.keys(variableMap).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        // Charger la valeur sauvegardée
        const saved = localStorage.getItem(`config-${fieldId}`);
        if (saved) {
            field.value = saved;
        }
        
        // Écouter les changements
        field.addEventListener('input', () => {
            localStorage.setItem(`config-${fieldId}`, field.value);
            updateCodeBlocks();
        });
        
        // Écouter aussi les changements de focus
        field.addEventListener('change', () => {
            localStorage.setItem(`config-${fieldId}`, field.value);
            updateCodeBlocks();
        });
    }
});

// Fonction pour réinitialiser la configuration
function resetConfig() {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les valeurs ?')) {
        Object.keys(variableMap).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
                localStorage.removeItem(`config-${fieldId}`);
            }
        });
        updateCodeBlocks();
    }
}

// Exposer la fonction resetConfig globalement
window.resetConfig = resetConfig;

// Mettre à jour au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updateCodeBlocks();
});

// Mettre à jour aussi après un court délai pour s'assurer que tout est chargé
setTimeout(updateCodeBlocks, 100);

// ============================================
// FONCTION POUR COPIER LE SCHÉMA SUPABASE
// ============================================
function copySupabaseSchema() {
    const schemaCode = document.getElementById('supabase-schema-code');
    const button = document.querySelector('.copy-sql-btn');
    
    if (schemaCode) {
        const code = schemaCode.textContent;
        navigator.clipboard.writeText(code).then(() => {
            // Animation de succès
            const originalText = button.innerHTML;
            button.innerHTML = '✅ Code SQL copié !';
            button.style.background = 'var(--success-color)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
            }, 3000);
        }).catch(err => {
            console.error('Erreur lors de la copie:', err);
            button.innerHTML = '❌ Erreur de copie';
            setTimeout(() => {
                button.innerHTML = '📋 Copier le schéma SQL complet';
            }, 2000);
        });
    }
}

// Exposer la fonction globalement
window.copySupabaseSchema = copySupabaseSchema;

// Fonction pour afficher/masquer le code SQL
function toggleSqlDisplay() {
    const block = document.getElementById('supabase-schema-block');
    const button = document.querySelector('.toggle-sql-btn');
    
    if (block) {
        if (block.style.display === 'none') {
            block.style.display = 'block';
            button.innerHTML = '👁️ Masquer le code SQL';
        } else {
            block.style.display = 'none';
            button.innerHTML = '👁️ Afficher le code SQL';
        }
    }
}

// Exposer la fonction globalement
window.toggleSqlDisplay = toggleSqlDisplay;

// ============================================
// GÉNÉRATEUR DE SCRIPT DE DÉPLOIEMENT
// ============================================

function generateDeploymentScript() {
    const values = getCurrentValues();
    
    // Vérifier que les valeurs essentielles sont remplies
    const required = ['VPS_IP', 'NOM_BOUTIQUE', 'SOUS_DOMAINE', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_KEY'];
    const missing = required.filter(key => !values[key] || values[key].includes('VOTRE') || values[key].includes('votre'));
    
    if (missing.length > 0) {
        alert('⚠️ Veuillez remplir tous les champs obligatoires avant de générer le script.\n\nChamps manquants : ' + missing.join(', '));
        return;
    }
    
    // Générer config.php
    const configPhp = generateConfigPhp(values);
    
    // Générer le script de déploiement
    const deployScript = generateDeployScript(values);
    
    // Générer le script .bat Windows
    const batScript = generateBatScript(values, configPhp);
    
    // Générer le script PowerShell (.ps1)
    const psScript = generatePowerShellScript(values, configPhp);
    
    // Générer le script Node.js
    const nodeScript = generateNodeScript(values, configPhp);
    
    // Générer la liste des actions manuelles
    const manualSteps = generateManualSteps(values);
    
    // Télécharger automatiquement les fichiers (avec un petit délai entre chaque)
    downloadPowerShellFile(psScript);
    setTimeout(() => downloadNodeFile(nodeScript), 500);
    setTimeout(() => downloadBatFile(batScript), 1000);
    
    // Afficher dans le modal
    document.getElementById('generated-config').textContent = configPhp;
    document.getElementById('generated-deploy').textContent = deployScript;
    document.getElementById('generated-ps1').textContent = psScript;
    document.getElementById('generated-node').textContent = nodeScript;
    document.getElementById('generated-bat').textContent = batScript;
    document.getElementById('manual-steps').innerHTML = manualSteps;
    
    // Afficher le modal
    document.getElementById('deployment-modal').style.display = 'flex';
    
    // Afficher un message de succès
    setTimeout(() => {
        alert('✅ Les fichiers de déploiement ont été téléchargés !\n\n📦 Fichiers téléchargés :\n- deploy.ps1 (PowerShell - RECOMMANDÉ)\n- deploy.js (Node.js)\n- run.bat (Windows)\n\n💡 Utilisez deploy.ps1 ou deploy.js pour plus de fiabilité !');
    }, 1500);
}

function generateConfigPhp(values) {
    return `<?php
// Configuration Supabase
define('SUPABASE_URL', '${values.SUPABASE_URL}');
define('SUPABASE_ANON_KEY', '${values.SUPABASE_ANON_KEY}');
define('SUPABASE_SERVICE_KEY', '${values.SUPABASE_SERVICE_KEY}');

// Telegram Guard (true = désactiver en développement)
define('TELEGRAM_BYPASS', false);

// Timezone
date_default_timezone_set('Europe/Paris');

// Debug (désactiver en production)
error_reporting(0);
ini_set('display_errors', 0);
`;
}

function generateDeployScript(values) {
    const cheminProjet = values.CHEMIN_PROJET && !values.CHEMIN_PROJET.includes('chemin') 
        ? values.CHEMIN_PROJET 
        : '/chemin/vers/votre/boutique';
    const hasChemin = cheminProjet !== '/chemin/vers/votre/boutique';
    
    let uploadSection = '';
    if (hasChemin) {
        uploadSection = `if [ -d "$CHEMIN_LOCAL" ]; then
    scp -r $CHEMIN_LOCAL/* root@$VPS_IP:$CHEMIN_VPS/
    echo "✅ Fichiers uploadés avec succès"
else
    echo "⚠️  Le chemin local '$CHEMIN_LOCAL' n'existe pas."
    echo "📋 Veuillez uploader les fichiers manuellement avec :"
    echo "   scp -r /chemin/vers/votre/boutique/* root@$VPS_IP:$CHEMIN_VPS/"
fi`;
    } else {
        uploadSection = `echo "⚠️  Le chemin du projet n'a pas été configuré."
echo "📋 Veuillez uploader les fichiers manuellement avec :"
echo "   scp -r /chemin/vers/votre/boutique/* root@$VPS_IP:$CHEMIN_VPS/"
echo ""
echo "Ou utilisez FileZilla/SFTP pour uploader les fichiers."`;
    }
    
    return `#!/bin/bash
# ============================================
# Script de déploiement automatique
# Généré le ${new Date().toLocaleDateString('fr-FR')}
# ============================================

set -e  # Arrêter en cas d'erreur

echo "🚀 Début du déploiement de ${values.NOM_BOUTIQUE}..."

# Variables
VPS_IP="${values.VPS_IP}"
NOM_BOUTIQUE="${values.NOM_BOUTIQUE}"
SOUS_DOMAINE="${values.SOUS_DOMAINE}"
CHEMIN_LOCAL="${cheminProjet}"
CHEMIN_VPS="/var/www/boutiques/${values.NOM_BOUTIQUE}"

# 1. Créer la boutique sur le VPS
echo "📦 Création de la boutique sur le VPS..."
ssh root@$VPS_IP "mkdir -p $CHEMIN_VPS && chown -R www-data:www-data $CHEMIN_VPS"

# 2. Uploader les fichiers
echo "📤 Upload des fichiers..."
${uploadSection}

# 3. Créer le fichier config.php
echo "⚙️  Configuration de config.php..."
ssh root@$VPS_IP "cat > $CHEMIN_VPS/config.php << 'EOF'
<?php
define('SUPABASE_URL', '${values.SUPABASE_URL}');
define('SUPABASE_ANON_KEY', '${values.SUPABASE_ANON_KEY}');
define('SUPABASE_SERVICE_KEY', '${values.SUPABASE_SERVICE_KEY}');
define('TELEGRAM_BYPASS', false);
date_default_timezone_set('Europe/Paris');
error_reporting(0);
ini_set('display_errors', 0);
EOF
"

# 4. Configurer les permissions
echo "🔐 Configuration des permissions..."
ssh root@$VPS_IP "chmod 755 $CHEMIN_VPS && chmod -R 755 $CHEMIN_VPS/data 2>/dev/null || mkdir -p $CHEMIN_VPS/data && chmod 755 $CHEMIN_VPS/data"

# 5. Créer le VirtualHost Apache (si le script existe)
echo "🌐 Configuration Apache..."
ssh root@$VPS_IP "if [ -f /usr/local/bin/create-boutique.sh ]; then
    /usr/local/bin/create-boutique.sh $NOM_BOUTIQUE $SOUS_DOMAINE
else
    echo '⚠️  Le script create-boutique.sh n\\'existe pas. Créez le VirtualHost manuellement.'
fi"

# 6. Obtenir le certificat SSL
echo "🔒 Configuration SSL..."
ssh root@$VPS_IP "certbot --apache -d $SOUS_DOMAINE --non-interactive --agree-tos --email admin@$SOUS_DOMAINE || echo '⚠️  Certbot a échoué. Configurez SSL manuellement.'"

echo "✅ Déploiement terminé !"
echo ""
echo "📋 Actions manuelles restantes :"
echo "   1. Configurez le DNS pour $SOUS_DOMAINE → $VPS_IP"
echo "   2. Créez le compte admin via https://$SOUS_DOMAINE/create_admin.php"
echo "   3. Supprimez create_admin.php après création du compte"
echo "   4. Vérifiez que la boutique fonctionne : https://$SOUS_DOMAINE/shop/"
`;
}

function generateManualSteps(values) {
    const steps = [];
    
    steps.push(`
        <div class="manual-step">
            <h3>1. Configuration DNS</h3>
            <p>Dans votre panneau DNS, ajoutez un enregistrement :</p>
            <ul>
                <li><strong>Type:</strong> A</li>
                <li><strong>Name:</strong> ${values.SOUS_DOMAINE.split('.')[0]}</li>
                <li><strong>Value:</strong> ${values.VPS_IP}</li>
                <li><strong>TTL:</strong> 3600</li>
            </ul>
            <p class="note">⏱️ La propagation DNS peut prendre jusqu'à 24h (généralement quelques minutes)</p>
        </div>
    `);
    
    steps.push(`
        <div class="manual-step">
            <h3>2. Créer le compte admin</h3>
            <ol>
                <li>Accédez à : <code>https://${values.SOUS_DOMAINE}/create_admin.php</code></li>
                <li>Remplissez le formulaire</li>
                <li>Créez votre compte</li>
                <li><strong>IMPORTANT :</strong> Supprimez ensuite le fichier <code>create_admin.php</code></li>
            </ol>
        </div>
    `);
    
    steps.push(`
        <div class="manual-step">
            <h3>3. Vérifier Supabase</h3>
            <ol>
                <li>Allez sur <a href="https://supabase.com/dashboard" target="_blank">Supabase Dashboard</a></li>
                <li>Vérifiez que toutes les tables sont créées</li>
                <li>Exécutez le schéma SQL si ce n'est pas déjà fait</li>
            </ol>
        </div>
    `);
    
    steps.push(`
        <div class="manual-step">
            <h3>4. Tests finaux</h3>
            <ul>
                <li>✅ Boutique accessible : <code>https://${values.SOUS_DOMAINE}/shop/</code></li>
                <li>✅ Panel admin : <code>https://${values.SOUS_DOMAINE}/admin/</code></li>
                <li>✅ Produits s'affichent</li>
                <li>✅ Panier fonctionne</li>
            </ul>
        </div>
    `);
    
    if (!values.CHEMIN_PROJET || values.CHEMIN_PROJET.includes('chemin')) {
        steps.push(`
            <div class="manual-step warning">
                <h3>⚠️ Upload manuel des fichiers</h3>
                <p>Le chemin du projet n'est pas configuré. Vous devez uploader les fichiers manuellement :</p>
                <div class="code-block">
                    <pre><code>scp -r /chemin/vers/votre/boutique/* root@${values.VPS_IP}:/var/www/boutiques/${values.NOM_BOUTIQUE}/</code></pre>
                </div>
            </div>
        `);
    }
    
    return steps.join('');
}

function showTab(tabName, button) {
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'onglet sélectionné
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Activer le bouton correspondant
    if (button) {
        button.classList.add('active');
    }
}

function copyGenerated(type) {
    let code;
    if (type === 'config') {
        code = document.getElementById('generated-config').textContent;
    } else if (type === 'deploy') {
        code = document.getElementById('generated-deploy').textContent;
    } else if (type === 'ps1') {
        code = document.getElementById('generated-ps1').textContent;
    } else if (type === 'node') {
        code = document.getElementById('generated-node').textContent;
    } else if (type === 'bat') {
        code = document.getElementById('generated-bat').textContent;
    }
    
    navigator.clipboard.writeText(code).then(() => {
        const btn = event.target;
        const original = btn.innerHTML;
        btn.innerHTML = '✅ Copié !';
        setTimeout(() => {
            btn.innerHTML = original;
        }, 2000);
    });
}

function closeModal() {
    document.getElementById('deployment-modal').style.display = 'none';
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('deployment-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// ============================================
// GÉNÉRATION DU FICHIER .BAT WINDOWS
// ============================================

function generateBatScript(values, configPhp) {
    const cheminProjet = values.CHEMIN_PROJET && !values.CHEMIN_PROJET.includes('chemin') 
        ? values.CHEMIN_PROJET.replace(/\\/g, '/') 
        : '%CD%';
    
    const hasPassword = values.VPS_PASSWORD && values.VPS_PASSWORD.trim() !== '';
    
    // Fonction pour échapper les caractères spéciaux pour .bat
    const escapeBat = (str) => {
        if (!str) return '';
        return str
            .replace(/\^/g, '^^')
            .replace(/&/g, '^&')
            .replace(/</g, '^<')
            .replace(/>/g, '^>')
            .replace(/\|/g, '^|')
            .replace(/"/g, '""')
            .replace(/%/g, '%%');
    };
    
    // Créer le contenu config.php
    const configPhpContent = `<?php
// Configuration Supabase
define('SUPABASE_URL', '${values.SUPABASE_URL}');
define('SUPABASE_ANON_KEY', '${values.SUPABASE_ANON_KEY}');
define('SUPABASE_SERVICE_KEY', '${values.SUPABASE_SERVICE_KEY}');

// Telegram Guard
define('TELEGRAM_BYPASS', false);

// Timezone
date_default_timezone_set('Europe/Paris');

// Debug
error_reporting(0);
ini_set('display_errors', 0);
`;
    
    // Échapper pour PowerShell (échapper $ et backticks)
    const configPhpEscaped = configPhpContent.replace(/\$/g, '`$').replace(/`/g, '``');
    
    // Échapper les valeurs pour la méthode alternative batch
    const supabaseUrlEscaped = escapeBat(values.SUPABASE_URL);
    const supabaseAnonEscaped = escapeBat(values.SUPABASE_ANON_KEY);
    const supabaseServiceEscaped = escapeBat(values.SUPABASE_SERVICE_KEY);
    
    // Fonction helper pour les commandes SSH avec mot de passe
    const sshCommand = (command) => {
        if (hasPassword) {
            return `(
    where sshpass >nul 2>&1 && (
        sshpass -p "${values.VPS_PASSWORD}" ssh -o StrictHostKeyChecking=no root@%VPS_IP% "${command}"
    ) || (
        where plink >nul 2>&1 && (
            echo ${values.VPS_PASSWORD}| plink -ssh -pw ${values.VPS_PASSWORD} root@%VPS_IP% "${command}"
        ) || (
            echo    ⚠️  sshpass/plink non trouvé. Entrez le mot de passe manuellement :
            ssh -o StrictHostKeyChecking=no root@%VPS_IP% "${command}"
        )
    )
)`;
        } else {
            return `ssh -o StrictHostKeyChecking=no root@%VPS_IP% "${command}"`;
        }
    };
    
    // Fonction helper pour les commandes SCP avec mot de passe
    const scpCommand = (source, dest) => {
        if (hasPassword) {
            return `(
    where sshpass >nul 2>&1 && (
        sshpass -p "${values.VPS_PASSWORD}" scp -o StrictHostKeyChecking=no "${source}" root@%VPS_IP%:${dest}
    ) || (
        where plink >nul 2>&1 && (
            echo ${values.VPS_PASSWORD}| pscp -pw ${values.VPS_PASSWORD} "${source}" root@%VPS_IP%:${dest}
        ) || (
            echo    ⚠️  sshpass/pscp non trouvé. Entrez le mot de passe manuellement :
            scp -o StrictHostKeyChecking=no "${source}" root@%VPS_IP%:${dest}
        )
    )
)`;
        } else {
            return `scp -o StrictHostKeyChecking=no "${source}" root@%VPS_IP%:${dest}`;
        }
    };
    
    return `@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ============================================
REM Script de déploiement automatique Windows
REM Généré le ${new Date().toLocaleDateString('fr-FR')}
REM ============================================

echo.
echo ============================================
echo 🚀 DÉPLOIEMENT AUTOMATIQUE
echo ============================================
echo.

REM Variables
set "VPS_IP=${values.VPS_IP}"
set "NOM_BOUTIQUE=${values.NOM_BOUTIQUE}"
set "SOUS_DOMAINE=${values.SOUS_DOMAINE}"
set "CHEMIN_LOCAL=${cheminProjet}"
set "CHEMIN_VPS=/var/www/boutiques/${values.NOM_BOUTIQUE}"
set "VPS_PASSWORD=${hasPassword ? values.VPS_PASSWORD : ''}"

REM Vérifier que PuTTY/OpenSSH est installé
where ssh >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  SSH n'est pas installé ou n'est pas dans le PATH.
    echo.
    echo 📥 Installation requise :
    echo    1. Installez Git for Windows (inclut OpenSSH)
    echo    2. Ou installez OpenSSH séparément
    echo    3. Redémarrez ce script après installation
    echo.
    pause
    exit /b 1
)

REM 1. Créer le fichier config.php localement
echo 📝 Création du fichier config.php...
REM Utiliser PowerShell pour créer le fichier de manière sûre
powershell -NoProfile -Command "$url = '${values.SUPABASE_URL.replace(/'/g, "''").replace(/\\/g, '\\\\')}'; $anon = '${values.SUPABASE_ANON_KEY.replace(/'/g, "''").replace(/\\/g, '\\\\')}'; $service = '${values.SUPABASE_SERVICE_KEY.replace(/'/g, "''").replace(/\\/g, '\\\\')}'; $nl = [Environment]::NewLine; $content = '<?php' + $nl + $nl + '// Configuration Supabase' + $nl + \"define('SUPABASE_URL', '$url');\" + $nl + \"define('SUPABASE_ANON_KEY', '$anon');\" + $nl + \"define('SUPABASE_SERVICE_KEY', '$service');\" + $nl + $nl + '// Telegram Guard' + $nl + \"define('TELEGRAM_BYPASS', false);\" + $nl + $nl + '// Timezone' + $nl + \"date_default_timezone_set('Europe/Paris');\" + $nl + $nl + '// Debug' + $nl + 'error_reporting(0);' + $nl + \"ini_set('display_errors', 0);\" + $nl; [System.IO.File]::WriteAllText('$PWD\\config.php', $content, [System.Text.Encoding]::UTF8)"
if %errorlevel% neq 0 (
    echo ⚠️  Erreur lors de la création avec PowerShell
    echo    Le fichier config.php sera créé manuellement plus tard
    echo    Contenu à copier dans config.php :
    echo.
    echo ^<?php
    echo.
    echo // Configuration Supabase
    echo define^('SUPABASE_URL', 'URL_ICI'^);
    echo define^('SUPABASE_ANON_KEY', 'CLE_ANON_ICI'^);
    echo define^('SUPABASE_SERVICE_KEY', 'CLE_SERVICE_ICI'^);
    echo.
    echo // Telegram Guard
    echo define^('TELEGRAM_BYPASS', false^);
    echo.
    echo // Timezone
    echo date_default_timezone_set^('Europe/Paris'^);
    echo.
    echo // Debug
    echo error_reporting^(0^);
    echo ini_set^('display_errors', 0^);
    echo.
    pause
)

if exist config.php (
    echo ✅ config.php créé avec succès
) else (
    echo ❌ Erreur lors de la création de config.php
    pause
    exit /b 1
)

REM 2. Créer la boutique sur le VPS
echo.
echo 📦 Création de la boutique sur le VPS...
if not "%VPS_PASSWORD%"=="" (
    REM Utiliser sshpass si disponible, sinon utiliser expect
    where sshpass >nul 2>&1
    if %errorlevel% equ 0 (
        echo    Utilisation de sshpass pour l'authentification automatique...
        sshpass -p "%VPS_PASSWORD%" ssh -o StrictHostKeyChecking=no root@%VPS_IP% "mkdir -p %CHEMIN_VPS% && chown -R www-data:www-data %CHEMIN_VPS%"
    ) else (
        REM Essayer avec plink (PuTTY) si disponible
        where plink >nul 2>&1
        if %errorlevel% equ 0 (
            echo    Utilisation de plink pour l'authentification automatique...
            echo %VPS_PASSWORD%| plink -ssh -pw %VPS_PASSWORD% root@%VPS_IP% "mkdir -p %CHEMIN_VPS% && chown -R www-data:www-data %CHEMIN_VPS%"
        ) else (
            REM Sinon, demander le mot de passe manuellement
            echo    ⚠️  sshpass ou plink non trouvé. Le mot de passe sera demandé manuellement.
            echo    Entrez le mot de passe SSH quand demandé :
            ssh -o StrictHostKeyChecking=no root@%VPS_IP% "mkdir -p %CHEMIN_VPS% && chown -R www-data:www-data %CHEMIN_VPS%"
        )
    )
) else (
    echo    Entrez le mot de passe SSH quand demandé :
    ssh -o StrictHostKeyChecking=no root@%VPS_IP% "mkdir -p %CHEMIN_VPS% && chown -R www-data:www-data %CHEMIN_VPS%"
)
if %errorlevel% neq 0 (
    echo ⚠️  Erreur lors de la connexion au VPS. Vérifiez :
    echo    - Que l'IP est correcte : %VPS_IP%
    echo    - Que vous avez accès SSH
    echo    - Que le mot de passe est correct
    pause
    exit /b 1
)
echo ✅ Dossier créé sur le VPS

REM 3. Uploader les fichiers
echo.
echo 📤 Upload des fichiers...
if "%CHEMIN_LOCAL%"=="%CD%" (
    echo 📁 Upload depuis le dossier actuel...
    echo    (Sauf run.bat et config.php qui seront uploadés séparément)
    REM Utiliser rsync si disponible, sinon scp récursif
    where rsync >nul 2>&1
    if %errorlevel% equ 0 (
        if not "%VPS_PASSWORD%"=="" (
            where sshpass >nul 2>&1
            if %errorlevel% equ 0 (
                sshpass -p "%VPS_PASSWORD%" rsync -avz --exclude="run.bat" --exclude="config.php" --exclude=".git" ./ root@%VPS_IP%:%CHEMIN_VPS%/
            ) else (
                rsync -avz --exclude="run.bat" --exclude="config.php" --exclude=".git" ./ root@%VPS_IP%:%CHEMIN_VPS%/
            )
        ) else (
            rsync -avz --exclude="run.bat" --exclude="config.php" --exclude=".git" ./ root@%VPS_IP%:%CHEMIN_VPS%/
        )
    ) else (
        REM Méthode alternative avec scp
        echo    Utilisation de scp (peut être lent pour beaucoup de fichiers)...
        if not "%VPS_PASSWORD%"=="" (
            where sshpass >nul 2>&1
            if %errorlevel% equ 0 (
                for /r %%f in (*) do (
                    if not "%%f"=="%CD%\\run.bat" (
                        set "relpath=%%f"
                        set "relpath=!relpath:%CD%\\=!"
                        set "relpath=!relpath:\\=/!"
                        sshpass -p "%VPS_PASSWORD%" ssh -o StrictHostKeyChecking=no root@%VPS_IP% "mkdir -p %CHEMIN_VPS%/!relpath!" 2>nul
                        sshpass -p "%VPS_PASSWORD%" scp -o StrictHostKeyChecking=no "%%f" root@%VPS_IP%:%CHEMIN_VPS%/!relpath! 2>nul
                    )
                )
            ) else (
                echo    ⚠️  sshpass non trouvé. Le mot de passe sera demandé pour chaque fichier.
                for /r %%f in (*) do (
                    if not "%%f"=="%CD%\\run.bat" (
                        set "relpath=%%f"
                        set "relpath=!relpath:%CD%\\=!"
                        set "relpath=!relpath:\\=/!"
                        ssh -o StrictHostKeyChecking=no root@%VPS_IP% "mkdir -p %CHEMIN_VPS%/!relpath!" 2>nul
                        scp -o StrictHostKeyChecking=no "%%f" root@%VPS_IP%:%CHEMIN_VPS%/!relpath! 2>nul
                    )
                )
            )
        ) else (
            for /r %%f in (*) do (
                if not "%%f"=="%CD%\\run.bat" (
                    set "relpath=%%f"
                    set "relpath=!relpath:%CD%\\=!"
                    set "relpath=!relpath:\\=/!"
                    ssh -o StrictHostKeyChecking=no root@%VPS_IP% "mkdir -p %CHEMIN_VPS%/!relpath!" 2>nul
                    scp -o StrictHostKeyChecking=no "%%f" root@%VPS_IP%:%CHEMIN_VPS%/!relpath! 2>nul
                )
            )
        )
    )
) else (
    if exist "%CHEMIN_LOCAL%" (
        echo 📁 Upload depuis : %CHEMIN_LOCAL%
        where rsync >nul 2>&1
        if %errorlevel% equ 0 (
            if not "%VPS_PASSWORD%"=="" (
                where sshpass >nul 2>&1
                if %errorlevel% equ 0 (
                    sshpass -p "%VPS_PASSWORD%" rsync -avz --exclude=".git" "%CHEMIN_LOCAL%/" root@%VPS_IP%:%CHEMIN_VPS%/
                ) else (
                    rsync -avz --exclude=".git" "%CHEMIN_LOCAL%/" root@%VPS_IP%:%CHEMIN_VPS%/
                )
            ) else (
                rsync -avz --exclude=".git" "%CHEMIN_LOCAL%/" root@%VPS_IP%:%CHEMIN_VPS%/
            )
        ) else (
            if not "%VPS_PASSWORD%"=="" (
                where sshpass >nul 2>&1
                if %errorlevel% equ 0 (
                    sshpass -p "%VPS_PASSWORD%" scp -r "%CHEMIN_LOCAL%\\*" root@%VPS_IP%:%CHEMIN_VPS%/
                ) else (
                    echo    ⚠️  sshpass non trouvé. Le mot de passe sera demandé.
                    scp -r "%CHEMIN_LOCAL%\\*" root@%VPS_IP%:%CHEMIN_VPS%/
                )
            ) else (
                scp -r "%CHEMIN_LOCAL%\\*" root@%VPS_IP%:%CHEMIN_VPS%/
            )
        )
    ) else (
        echo ⚠️  Le chemin '%CHEMIN_LOCAL%' n'existe pas.
        echo 📋 Veuillez uploader les fichiers manuellement avec FileZilla ou WinSCP
        echo    Vers : root@%VPS_IP%:%CHEMIN_VPS%/
    )
)

REM 4. Uploader config.php
echo.
echo ⚙️  Configuration de config.php sur le VPS...
scp config.php root@%VPS_IP%:%CHEMIN_VPS%/config.php
if %errorlevel% equ 0 (
    echo ✅ config.php uploadé avec succès
) else (
    echo ⚠️  Erreur lors de l'upload de config.php
)

REM 5. Configurer les permissions
echo.
echo 🔐 Configuration des permissions...
ssh root@%VPS_IP% "chmod 755 %CHEMIN_VPS% && mkdir -p %CHEMIN_VPS%/data && chmod 755 %CHEMIN_VPS%/data"
echo ✅ Permissions configurées

REM 6. Créer le VirtualHost Apache
echo.
echo 🌐 Configuration Apache...
ssh root@%VPS_IP% "if [ -f /usr/local/bin/create-boutique.sh ]; then /usr/local/bin/create-boutique.sh %NOM_BOUTIQUE% %SOUS_DOMAINE%; else echo '⚠️  Script create-boutique.sh non trouvé. Créez le VirtualHost manuellement.'; fi"

REM 7. Obtenir le certificat SSL
echo.
echo 🔒 Configuration SSL...
ssh root@%VPS_IP% "certbot --apache -d %SOUS_DOMAINE% --non-interactive --agree-tos --email admin@%SOUS_DOMAINE% 2>&1 || echo '⚠️  Certbot a échoué. Configurez SSL manuellement.'"

REM Résumé
echo.
echo ============================================
echo ✅ DÉPLOIEMENT TERMINÉ !
echo ============================================
echo.
echo 📋 Actions manuelles restantes :
echo.
echo    1. Configurez le DNS :
echo       Type: A
echo       Name: ${values.SOUS_DOMAINE.split('.')[0]}
echo       Value: %VPS_IP%
echo       TTL: 3600
echo.
echo    2. Créez le compte admin :
echo       https://%SOUS_DOMAINE%/create_admin.php
echo.
echo    3. Supprimez create_admin.php après création
echo.
echo    4. Vérifiez la boutique :
echo       https://%SOUS_DOMAINE%/shop/
echo.
echo    5. Vérifiez le panel admin :
echo       https://%SOUS_DOMAINE%/admin/
echo.
echo ============================================
echo.
pause
`;
}

// ============================================
// GÉNÉRATION DU SCRIPT POWERSHELL
// ============================================

function generatePowerShellScript(values, configPhp) {
    const cheminProjet = values.CHEMIN_PROJET && !values.CHEMIN_PROJET.includes('chemin') 
        ? values.CHEMIN_PROJET.replace(/\\/g, '/') 
        : '$PWD';
    
    const hasPassword = values.VPS_PASSWORD && values.VPS_PASSWORD.trim() !== '';
    
    // Échapper les valeurs pour PowerShell
    const escapePs = (str) => {
        if (!str) return '';
        return str.replace(/'/g, "''").replace(/\$/g, '`$');
    };
    
    return `# ============================================
# Script de déploiement automatique PowerShell
# Généré le ${new Date().toLocaleDateString('fr-FR')}
# ============================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🚀 DÉPLOIEMENT AUTOMATIQUE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$VPS_IP = "${values.VPS_IP}"
$NOM_BOUTIQUE = "${values.NOM_BOUTIQUE}"
$SOUS_DOMAINE = "${values.SOUS_DOMAINE}"
$CHEMIN_LOCAL = "${cheminProjet}"
$CHEMIN_VPS = "/var/www/boutiques/${values.NOM_BOUTIQUE}"
${hasPassword ? `$VPS_PASSWORD = "${values.VPS_PASSWORD}"` : '# $VPS_PASSWORD = ""'}

# Vérifier que SSH est installé
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  SSH n'est pas installé ou n'est pas dans le PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📥 Installation requise :" -ForegroundColor Cyan
    Write-Host "   1. Installez Git for Windows (inclut OpenSSH)"
    Write-Host "   2. Ou installez OpenSSH séparément"
    Write-Host "   3. Redémarrez ce script après installation"
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# 1. Créer le fichier config.php localement
Write-Host "📝 Création du fichier config.php..." -ForegroundColor Cyan
$configContent = @"
<?php
// Configuration Supabase
define('SUPABASE_URL', '${escapePs(values.SUPABASE_URL)}');
define('SUPABASE_ANON_KEY', '${escapePs(values.SUPABASE_ANON_KEY)}');
define('SUPABASE_SERVICE_KEY', '${escapePs(values.SUPABASE_SERVICE_KEY)}');

// Telegram Guard
define('TELEGRAM_BYPASS', false);

// Timezone
date_default_timezone_set('Europe/Paris');

// Debug
error_reporting(0);
ini_set('display_errors', 0);
"@

try {
    [System.IO.File]::WriteAllText("$PWD\\config.php", $configContent, [System.Text.Encoding]::UTF8)
    Write-Host "✅ config.php créé avec succès" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la création de config.php: $_" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# 2. Créer la boutique sur le VPS
Write-Host ""
Write-Host "📦 Création de la boutique sur le VPS..." -ForegroundColor Cyan
$sshCommand = "mkdir -p $CHEMIN_VPS && chown -R www-data:www-data $CHEMIN_VPS"

if ($VPS_PASSWORD) {
    if (Get-Command sshpass -ErrorAction SilentlyContinue) {
        Write-Host "   Utilisation de sshpass pour l'authentification automatique..." -ForegroundColor Gray
        $env:SSHPASS = $VPS_PASSWORD
        sshpass -e ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $sshCommand
    } else {
        Write-Host "   ⚠️  sshpass non trouvé. Le mot de passe sera demandé." -ForegroundColor Yellow
        Write-Host "   Entrez le mot de passe SSH quand demandé :" -ForegroundColor Yellow
        ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $sshCommand
    }
} else {
    Write-Host "   Entrez le mot de passe SSH quand demandé :" -ForegroundColor Yellow
    ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $sshCommand
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Erreur lors de la connexion au VPS." -ForegroundColor Red
    Write-Host "   Vérifiez :" -ForegroundColor Yellow
    Write-Host "   - Que l'IP est correcte : $VPS_IP"
    Write-Host "   - Que vous avez accès SSH"
    Write-Host "   - Que le mot de passe est correct"
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}
Write-Host "✅ Dossier créé sur le VPS" -ForegroundColor Green

# 3. Uploader les fichiers
Write-Host ""
Write-Host "📤 Upload des fichiers..." -ForegroundColor Cyan
if ($CHEMIN_LOCAL -eq $PWD) {
    Write-Host "📁 Upload depuis le dossier actuel..." -ForegroundColor Gray
    Write-Host "   (Sauf deploy.ps1, deploy.js, run.bat et config.php)" -ForegroundColor Gray
    
    if (Get-Command rsync -ErrorAction SilentlyContinue) {
        if ($VPS_PASSWORD -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
            $env:SSHPASS = $VPS_PASSWORD
            sshpass -e rsync -avz --exclude="deploy.ps1" --exclude="deploy.js" --exclude="run.bat" --exclude="config.php" --exclude=".git" ./ "root@$VPS_IP`:$CHEMIN_VPS/"
        } else {
            rsync -avz --exclude="deploy.ps1" --exclude="deploy.js" --exclude="run.bat" --exclude="config.php" --exclude=".git" ./ "root@$VPS_IP`:$CHEMIN_VPS/"
        }
    } else {
        Write-Host "   Utilisation de scp (peut être lent pour beaucoup de fichiers)..." -ForegroundColor Gray
        Get-ChildItem -Recurse -File | Where-Object { 
            $_.Name -notin @('deploy.ps1', 'deploy.js', 'run.bat', 'config.php')
        } | ForEach-Object {
            $relPath = $_.FullName.Replace($PWD, '').Replace('\\', '/').TrimStart('/')
            $remotePath = "$CHEMIN_VPS/$relPath"
            
            if ($VPS_PASSWORD -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
                $env:SSHPASS = $VPS_PASSWORD
                sshpass -e ssh -o StrictHostKeyChecking=no "root@$VPS_IP" "mkdir -p \$(dirname '$remotePath')" 2>$null
                sshpass -e scp -o StrictHostKeyChecking=no $_.FullName "root@$VPS_IP`:$remotePath" 2>$null
            } else {
                ssh -o StrictHostKeyChecking=no "root@$VPS_IP" "mkdir -p \$(dirname '$remotePath')" 2>$null
                scp -o StrictHostKeyChecking=no $_.FullName "root@$VPS_IP`:$remotePath" 2>$null
            }
        }
    }
} else {
    if (Test-Path $CHEMIN_LOCAL) {
        Write-Host "📁 Upload depuis : $CHEMIN_LOCAL" -ForegroundColor Gray
        if (Get-Command rsync -ErrorAction SilentlyContinue) {
            if ($VPS_PASSWORD -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
                $env:SSHPASS = $VPS_PASSWORD
                sshpass -e rsync -avz --exclude=".git" "$CHEMIN_LOCAL/" "root@$VPS_IP`:$CHEMIN_VPS/"
            } else {
                rsync -avz --exclude=".git" "$CHEMIN_LOCAL/" "root@$VPS_IP`:$CHEMIN_VPS/"
            }
        } else {
            if ($VPS_PASSWORD -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
                $env:SSHPASS = $VPS_PASSWORD
                sshpass -e scp -r "$CHEMIN_LOCAL\*" "root@$VPS_IP`:$CHEMIN_VPS/"
            } else {
                Write-Host "   ⚠️  sshpass non trouvé. Le mot de passe sera demandé." -ForegroundColor Yellow
                scp -r "$CHEMIN_LOCAL\*" "root@$VPS_IP`:$CHEMIN_VPS/"
            }
        }
    } else {
        Write-Host "⚠️  Le chemin '$CHEMIN_LOCAL' n'existe pas." -ForegroundColor Yellow
        Write-Host "📋 Veuillez uploader les fichiers manuellement avec FileZilla ou WinSCP" -ForegroundColor Cyan
        Write-Host "   Vers : root@$VPS_IP`:$CHEMIN_VPS/" -ForegroundColor Gray
    }
}

# 4. Uploader config.php
Write-Host ""
Write-Host "⚙️  Configuration de config.php sur le VPS..." -ForegroundColor Cyan
if ($VPS_PASSWORD -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
    $env:SSHPASS = $VPS_PASSWORD
    sshpass -e scp -o StrictHostKeyChecking=no config.php "root@$VPS_IP`:$CHEMIN_VPS/config.php"
} else {
    scp -o StrictHostKeyChecking=no config.php "root@$VPS_IP`:$CHEMIN_VPS/config.php"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ config.php uploadé avec succès" -ForegroundColor Green
} else {
    Write-Host "⚠️  Erreur lors de l'upload de config.php" -ForegroundColor Yellow
}

# 5. Configurer les permissions
Write-Host ""
Write-Host "🔐 Configuration des permissions..." -ForegroundColor Cyan
$permCommand = "chmod 755 $CHEMIN_VPS && mkdir -p $CHEMIN_VPS/data && chmod 755 $CHEMIN_VPS/data"
if ($VPS_PASSWORD -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
    $env:SSHPASS = $VPS_PASSWORD
    sshpass -e ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $permCommand
} else {
    ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $permCommand
}
Write-Host "✅ Permissions configurées" -ForegroundColor Green

# 6. Créer le VirtualHost Apache
Write-Host ""
Write-Host "🌐 Configuration Apache..." -ForegroundColor Cyan
$apacheCommand = "if [ -f /usr/local/bin/create-boutique.sh ]; then /usr/local/bin/create-boutique.sh $NOM_BOUTIQUE $SOUS_DOMAINE; else echo '⚠️  Script create-boutique.sh non trouvé. Créez le VirtualHost manuellement.'; fi"
if ($VPS_PASSWORD -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
    $env:SSHPASS = $VPS_PASSWORD
    sshpass -e ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $apacheCommand
} else {
    ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $apacheCommand
}

# 7. Obtenir le certificat SSL
Write-Host ""
Write-Host "🔒 Configuration SSL..." -ForegroundColor Cyan
$sslCommand = "certbot --apache -d $SOUS_DOMAINE --non-interactive --agree-tos --email admin@$SOUS_DOMAINE 2>&1 || echo '⚠️  Certbot a échoué. Configurez SSL manuellement.'"
if ($VPS_PASSWORD -and (Get-Command sshpass -ErrorAction SilentlyContinue)) {
    $env:SSHPASS = $VPS_PASSWORD
    sshpass -e ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $sslCommand
} else {
    ssh -o StrictHostKeyChecking=no "root@$VPS_IP" $sslCommand
}

# Résumé
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ DÉPLOIEMENT TERMINÉ !" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Actions manuelles restantes :" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Configurez le DNS :" -ForegroundColor Cyan
Write-Host "      Type: A"
Write-Host "      Name: $($SOUS_DOMAINE.Split('.')[0])"
Write-Host "      Value: $VPS_IP"
Write-Host "      TTL: 3600"
Write-Host ""
Write-Host "   2. Créez le compte admin :" -ForegroundColor Cyan
Write-Host "      https://$SOUS_DOMAINE/create_admin.php"
Write-Host ""
Write-Host "   3. Supprimez create_admin.php après création"
Write-Host ""
Write-Host "   4. Vérifiez la boutique :" -ForegroundColor Cyan
Write-Host "      https://$SOUS_DOMAINE/shop/"
Write-Host ""
Write-Host "   5. Vérifiez le panel admin :" -ForegroundColor Cyan
Write-Host "      https://$SOUS_DOMAINE/admin/"
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
`;
}

// ============================================
// GÉNÉRATION DU SCRIPT NODE.JS
// ============================================

function generateNodeScript(values, configPhp) {
    const cheminProjet = values.CHEMIN_PROJET && !values.CHEMIN_PROJET.includes('chemin') 
        ? values.CHEMIN_PROJET.replace(/\\/g, '/') 
        : 'process.cwd()';
    
    const hasPassword = values.VPS_PASSWORD && values.VPS_PASSWORD.trim() !== '';
    
    return `// ============================================
// Script de déploiement automatique Node.js
// Généré le ${new Date().toLocaleDateString('fr-FR')}
// ============================================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
    reset: '\\x1b[0m',
    green: '\\x1b[32m',
    yellow: '\\x1b[33m',
    red: '\\x1b[31m',
    cyan: '\\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(\`\${colors[color]}\${message}\${colors.reset}\`);
}

// Variables
const VPS_IP = "${values.VPS_IP}";
const NOM_BOUTIQUE = "${values.NOM_BOUTIQUE}";
const SOUS_DOMAINE = "${values.SOUS_DOMAINE}";
const CHEMIN_LOCAL = ${cheminProjet === 'process.cwd()' ? 'process.cwd()' : `"${cheminProjet}"`};
const CHEMIN_VPS = "/var/www/boutiques/${values.NOM_BOUTIQUE}";
${hasPassword ? `const VPS_PASSWORD = "${values.VPS_PASSWORD}";` : '// const VPS_PASSWORD = "";'}

// Fonction pour exécuter des commandes SSH
function execSSH(command, usePassword = false) {
    try {
        let cmd;
        if (usePassword && VPS_PASSWORD) {
            try {
                execSync('which sshpass', { stdio: 'ignore' });
                cmd = \`sshpass -p "\${VPS_PASSWORD}" ssh -o StrictHostKeyChecking=no root@\${VPS_IP} "\${command}"\`;
            } catch {
                log('⚠️  sshpass non trouvé. Le mot de passe sera demandé.', 'yellow');
                cmd = \`ssh -o StrictHostKeyChecking=no root@\${VPS_IP} "\${command}"\`;
            }
        } else {
            cmd = \`ssh -o StrictHostKeyChecking=no root@\${VPS_IP} "\${command}"\`;
        }
        return execSync(cmd, { stdio: 'inherit', encoding: 'utf8' });
    } catch (error) {
        throw error;
    }
}

// Fonction pour exécuter des commandes SCP
function execSCP(source, dest, usePassword = false) {
    try {
        let cmd;
        if (usePassword && VPS_PASSWORD) {
            try {
                execSync('which sshpass', { stdio: 'ignore' });
                cmd = \`sshpass -p "\${VPS_PASSWORD}" scp -o StrictHostKeyChecking=no "\${source}" root@\${VPS_IP}:\${dest}\`;
            } catch {
                log('⚠️  sshpass non trouvé. Le mot de passe sera demandé.', 'yellow');
                cmd = \`scp -o StrictHostKeyChecking=no "\${source}" root@\${VPS_IP}:\${dest}\`;
            }
        } else {
            cmd = \`scp -o StrictHostKeyChecking=no "\${source}" root@\${VPS_IP}:\${dest}\`;
        }
        return execSync(cmd, { stdio: 'inherit', encoding: 'utf8' });
    } catch (error) {
        throw error;
    }
}

// Vérifier que SSH est installé
try {
    execSync('which ssh', { stdio: 'ignore' });
} catch {
    log('⚠️  SSH n\\'est pas installé ou n\\'est pas dans le PATH.', 'yellow');
    log('');
    log('📥 Installation requise :', 'cyan');
    log('   1. Installez Git for Windows (inclut OpenSSH)');
    log('   2. Ou installez OpenSSH séparément');
    log('   3. Redémarrez ce script après installation');
    log('');
    process.exit(1);
}

log('');
log('============================================', 'cyan');
log('🚀 DÉPLOIEMENT AUTOMATIQUE', 'green');
log('============================================', 'cyan');
log('');

// 1. Créer le fichier config.php localement
log('📝 Création du fichier config.php...', 'cyan');
const configContent = \`<?php
// Configuration Supabase
define('SUPABASE_URL', '${values.SUPABASE_URL}');
define('SUPABASE_ANON_KEY', '${values.SUPABASE_ANON_KEY}');
define('SUPABASE_SERVICE_KEY', '${values.SUPABASE_SERVICE_KEY}');

// Telegram Guard
define('TELEGRAM_BYPASS', false);

// Timezone
date_default_timezone_set('Europe/Paris');

// Debug
error_reporting(0);
ini_set('display_errors', 0);
\`;

try {
    fs.writeFileSync(path.join(process.cwd(), 'config.php'), configContent, 'utf8');
    log('✅ config.php créé avec succès', 'green');
} catch (error) {
    log(\`❌ Erreur lors de la création de config.php: \${error.message}\`, 'red');
    process.exit(1);
}

// 2. Créer la boutique sur le VPS
log('');
log('📦 Création de la boutique sur le VPS...', 'cyan');
try {
    execSSH(\`mkdir -p \${CHEMIN_VPS} && chown -R www-data:www-data \${CHEMIN_VPS}\`, hasPassword);
    log('✅ Dossier créé sur le VPS', 'green');
} catch (error) {
    log('⚠️  Erreur lors de la connexion au VPS.', 'red');
    log('   Vérifiez :', 'yellow');
    log(\`   - Que l'IP est correcte : \${VPS_IP}\`);
    log('   - Que vous avez accès SSH');
    log('   - Que le mot de passe est correct');
    process.exit(1);
}

// 3. Uploader les fichiers
log('');
log('📤 Upload des fichiers...', 'cyan');
log('   (Upload simplifié - utilisez rsync ou scp -r pour tous les fichiers)', 'yellow');

// 4. Uploader config.php
log('');
log('⚙️  Configuration de config.php sur le VPS...', 'cyan');
try {
    execSCP('config.php', \`\${CHEMIN_VPS}/config.php\`, hasPassword);
    log('✅ config.php uploadé avec succès', 'green');
} catch (error) {
    log('⚠️  Erreur lors de l'upload de config.php', 'yellow');
}

// 5. Configurer les permissions
log('');
log('🔐 Configuration des permissions...', 'cyan');
try {
    execSSH(\`chmod 755 \${CHEMIN_VPS} && mkdir -p \${CHEMIN_VPS}/data && chmod 755 \${CHEMIN_VPS}/data\`, hasPassword);
    log('✅ Permissions configurées', 'green');
} catch (error) {
    log('⚠️  Erreur lors de la configuration des permissions', 'yellow');
}

// 6. Créer le VirtualHost Apache
log('');
log('🌐 Configuration Apache...', 'cyan');
try {
    execSSH(\`if [ -f /usr/local/bin/create-boutique.sh ]; then /usr/local/bin/create-boutique.sh \${NOM_BOUTIQUE} \${SOUS_DOMAINE}; else echo '⚠️  Script create-boutique.sh non trouvé. Créez le VirtualHost manuellement.'; fi\`, hasPassword);
} catch (error) {
    log('⚠️  Erreur lors de la configuration Apache', 'yellow');
}

// 7. Obtenir le certificat SSL
log('');
log('🔒 Configuration SSL...', 'cyan');
try {
    execSSH(\`certbot --apache -d \${SOUS_DOMAINE} --non-interactive --agree-tos --email admin@\${SOUS_DOMAINE} 2>&1 || echo '⚠️  Certbot a échoué. Configurez SSL manuellement.'\`, hasPassword);
} catch (error) {
    log('⚠️  Erreur lors de la configuration SSL', 'yellow');
}

// Résumé
log('');
log('============================================', 'cyan');
log('✅ DÉPLOIEMENT TERMINÉ !', 'green');
log('============================================', 'cyan');
log('');
log('📋 Actions manuelles restantes :', 'yellow');
log('');
log('   1. Configurez le DNS :', 'cyan');
log(\`      Type: A\`);
log(\`      Name: \${SOUS_DOMAINE.split('.')[0]}\`);
log(\`      Value: \${VPS_IP}\`);
log(\`      TTL: 3600\`);
log('');
log('   2. Créez le compte admin :', 'cyan');
log(\`      https://\${SOUS_DOMAINE}/create_admin.php\`);
log('');
log('   3. Supprimez create_admin.php après création');
log('');
log('   4. Vérifiez la boutique :', 'cyan');
log(\`      https://\${SOUS_DOMAINE}/shop/\`);
log('');
log('   5. Vérifiez le panel admin :', 'cyan');
log(\`      https://\${SOUS_DOMAINE}/admin/\`);
log('');
log('============================================', 'cyan');
`;
}

function downloadBatFile(content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'run.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadPowerShellFile(content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deploy.ps1';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadNodeFile(content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deploy.js';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ============================================
// GESTION DU THÈME SOMBRE/CLAIR
// ============================================

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Initialiser le thème au chargement
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});

// Exposer les fonctions globalement
window.generateDeploymentScript = generateDeploymentScript;
window.showTab = showTab;
window.copyGenerated = copyGenerated;
window.closeModal = closeModal;
window.toggleTheme = toggleTheme;

